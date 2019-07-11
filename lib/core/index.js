const startTime = new Date;
const os = require( 'os' );
const fs = require( 'fs' );
const path = require( 'path' );
const querystring = require( 'querystring' );
const Koa = require( 'koa' );
const body = require( 'koa-body' );
const compose = require( 'koa-compose' );
const preuse = require( 'koa-preuse' );
const sham = require( 'koa-sham' );
const serve = require( 'koa-static' );
const winston = require( 'winston' );
const WinstonTransport = require( 'winston-transport' );
const is = require( '@lvchengbin/is' );
const Router = require( '../router' );
const Console = require( '../console' );
const BaseMixin = require( '../base-mixin' );
const RSC = require( '../rsc' );
const Runtime = require( '../runtime' );
const cargs = require( '../cargs' );
const C = require( '../constants' );
const output = require( '../output' );

require( 'winston-daily-rotate-file' );

const YNN_GLOBAL_MOUNTING_DATA = Symbol.for( 'ynn#global#mounting#data' );

const mounting = global[ YNN_GLOBAL_MOUNTING_DATA ];

const INIT_CONFIG = Symbol( 'init#config' );
const INIT_LOGGER = Symbol( 'init#logger' );
const INIT_PLUGINS = Symbol( 'init#plugins' );
const INIT_ACCESS_LOGGER = Symbol( 'init#access#logger' );
const INIT_RSC_LOGGER = Symbol( 'init#rsc#logger' );
const EXECUTE_MIDDLEWARE = Symbol( 'execute#middleware' );
const YNN_KEYS = Symbol( 'ynn#keys' );
const YNN_EXECUTE = Symbol( 'ynn#execute' );
const YNN_ACCESS_LOG = Symbol( 'ynn#access#log' );
const YNN_BOUND_ACCESS_LOG_MIDDLEWARE = Symbol( 'ynn#bound#access#log#middleware' );
const YNN_PORT = Symbol.for( 'ynn#port' );
const YNN_UDS = Symbol( 'ynn#uds' );
const YNN_PARSE_LOG_CONFIG_ITEM = Symbol( 'ynn#parse#log#config#item' );
const YNN_CTX_RESPOND_TIME = Symbol( 'ynn#ctx#respond#time' );

/**
 * Class representing a Application extends from Koa
 */
class Ynn extends BaseMixin( Koa ) {
    constructor( options = {} ) {
        super();
        this.setMaxListeners( 30 );
        if( is.undefined( options.debugging ) ) {
            if( cargs.hasOwnProperty( 'debugging' ) ) {
                options.debugging = cargs.debugging;
            } else {
                options.debugging = this.parent ? this.parent.debugging : C.DEBUGGING_DEFAULT;
            }
        }

        Object.assign( this, options, cargs );

        this.output = output( this );
        
        this.isYnn = true;
        this.console = new Console( this );

        this.configs = [];
        this.controllers = {};
        this.services = {};

        this.isModule = !!mounting.status;

        if( this.isModule ) {
            this.root || ( this.root = path.dirname( mounting.path ) );
            this.name = mounting.name;
            this.parent = mounting.parent;
            this.top = this.parent.top;
            this[ 'log-path' ] = mounting[ 'log-path' ];
            this.path = [];
            let app = this;
            if( mounting.logging === false || mounting.logging === C.LOGGING_DISABLE_ALL ) {
                this.logging = mounting.logging;
            }
            while( app.name ) {
                this.path.unshift( app.name );
                app = app.parent;
            }
            this[ INIT_CONFIG ]( options.configs );
        } else {
            this.top = this;
            if( !this.root ) {
                this.root = path.dirname( require.main.filename );
            }

            this[ INIT_CONFIG ]( options.configs );
            /**
             * to use the log-path which is passed from command line arguments if exists
             * otherwise, to use the log-path set in options if exists
             * otherwise, to get log.path from config file
             */
            this[ 'log-path' ] = path.resolve( this.root, cargs[ 'log-path' ] || this[ 'log-path' ] || this.config( 'log.path' ) );
        }

        winston.transports.NULL = class extends WinstonTransport{ log() {} };
        if( !this.logger ) {
            this[ INIT_LOGGER ]();
        }
        this[ INIT_ACCESS_LOGGER ]();
        this[ INIT_RSC_LOGGER ]();
        this.use( ( ctx, next ) => {
            if( !ctx[ YNN_CTX_RESPOND_TIME ] ) {
                ctx[ YNN_CTX_RESPOND_TIME ] = process.hrtime();
            }
            return next();
        } );
        this.use( RSC.middleware() );
        const bodyParser = body( { multipart : true } );
        this.use( ( ctx, next ) => {
            /**
             * koa-body doesn't check if the raw request body has already been parsed.
             */
            if( is.undefined( ctx.request.body ) ) {
                return bodyParser( ctx, next );
            } else {
                return next();
            }
        } );
        this.use( this[ YNN_ACCESS_LOG ]() );
    }

    listen( ...args ) {
        /**
         * the port that specified in command line will override the argument.
         */
        if( cargs.hasOwnProperty( 'port' ) ) {
            args[ 0 ] = cargs.port;
        }

        const listen = super.listen( ...args );
        const address = listen.address();

        if( is.string( address ) ) {
            this[ YNN_UDS ] = address;
        } else {
            this[ YNN_PORT ] = address.port || null;
        }
        this.ready( () => this.summarize() );
        return listen;
    }

    summarize() {
        const summary = Object.assign( {
            log : this.logging ? this[ 'log-path' ] : false,
            time : new Date - startTime,
            memory : process.memoryUsage().heapUsed
        }, this.toJSON() );

        this.console.spec( Array( 72 ).join( '-' ) );
        this.console.spec( 'Application is ready.' );
        this.console.spec( `Log: ${summary.log}` );
        this.console.spec( `Configs: [ ${summary.configs.join( ', ' )} ].` );
        this.console.spec( `Modules: [ ${summary.modules.join( ', ' )} ].` );
        this.console.spec( `Controllers: [ ${summary.controllers.join( ', ' )} ].` );
        this.console.spec( `Services: [ ${summary.services.join( ', ' )} ].` );
        this.console.spec( `Plugins: [ ${summary.plugins.join( ', ' )} ].` );
        summary.port && this.console.spec( `Port: ${summary.port} - http://127.0.0.1:${summary.port}.` );
        summary.uds && this.console.spec( `UDS: ${summary.uds} [Unix-Domain Socket].` );
        this.console.spec( `Date: ${new Date}.` );
        this.console.spec( `Time: ${summary.time}ms.` );
        this.console.spec( `Memory: ${(summary.memory / 1024 / 1024 ).toFixed(2)}MB.` );
        this.console.spec( Array( 72 ).join( '-' ) );
    }

    /**
     * to start to listen to an Inter-Process Communication Socket.
     * In windows, named pipe will be used and in unix, unix-domain socket will be used.
     */
    listenIPCSocket( sock, unlink = true ) {
        if( os.platform() === 'win32' ) {
            return this.listen( ...arguments );
        } else {
            try {
                unlink && fs.unlinkSync( sock );
            } finally {
                return this.listen( sock ); // eslint-disable-line no-unsafe-finally
            }
        }
    }

    /**
     * to overwrite the app.keys of koajs
     */
    get keys() {
        let app = this, keys;
        while( app ) {
            if( app[ YNN_KEYS ] ) keys = app[ YNN_KEYS ];
            app = app.parent;
        }
        return keys;
    }

    set keys( k ) {
        this[ YNN_KEYS ] = k;
    }

    [ YNN_ACCESS_LOG ]() {
        return ( ctx, next ) => {
            if( ctx[ YNN_BOUND_ACCESS_LOG_MIDDLEWARE ] ) return next();
            ctx[ YNN_BOUND_ACCESS_LOG_MIDDLEWARE ] = true;
            const { res, req, request, response, query } = ctx;
            const { headers } = request;
            const done = () => {
                let track = '-';
                if( ctx.ynnTrack && ctx.ynnTrack.length > 1 ) {
                    const t = [];
                    for( const item of ctx.ynnTrack ) {
                        t.push( item.step || '' );
                    }
                    track = t.join( '->' );
                }

                const qs = querystring.stringify( query );
                const time = ctx[ YNN_CTX_RESPOND_TIME ] && process.hrtime( ctx[ YNN_CTX_RESPOND_TIME ] );

                const ip = headers[ 'x-real-ip' ] || request.ip;

                const msg = [
                    `${ip} - - ${new Date}`,
                    `"${ctx.method}: ${ctx.ynnOriginalPath||request.path}${qs?'?'+qs:''} ${request.protocol.toUpperCase()}/${req.httpVersion}"`,
                    `"${track}"`,
                    res.statusCode,
                    response.length,
                    time ? ( time[ 0 ] * 1000 + time[ 1 ] / 1000000 ).toFixed( 2 ) + 'ms' : '-',
                    `"${headers.referer||'-'}"`,
                    `"${headers['user-agent']||'-'}"`
                ].join( ' ' );

                res.removeListener( 'close', done );
                res.removeListener( 'finish', done );
                this.console.log( msg );
                this.accessLogger.info( msg );
            };

            res.once( 'close', done );
            res.once( 'finish', done );
            return next();
        };
    }

    [ YNN_PARSE_LOG_CONFIG_ITEM ]( level, config = {} ) {
        const c = Object.assign( {}, config );
        if( !c.level && !c.levels ) {
            c.level = level;
        }

        if( c.console ) {
            return new winston.transports.Console( c);
        }

        if( c.filename ) {
            c.filename = path.resolve( this[ 'log-path' ], c.filename );
        }

        if( c.dailyrotate ) {
            return new winston.transports.DailyRotateFile( c );
        } else {
            return new winston.transports.File( c );
        }
    }

    async [ INIT_LOGGER ]() {
        /**
         * to init logger before initializing other parts
         */
        const levels = this.config( 'log.levels' );

        if( this.logging === false || this.logging === C.LOGGING_DISABLE || this.logging === C.LOGGING_DISABLE_ALL || !levels ) {
            this.logger = winston.createLogger( {
                transports : [ new winston.transports.NULL ]
            } );
            return;
        }
        const transports = [];

        for( const level in levels ) {
            transports.push( this[ YNN_PARSE_LOG_CONFIG_ITEM ]( level, levels[ level ] ) );
        }
        this.logger = winston.createLogger( { transports } );
    }

    async [ INIT_ACCESS_LOGGER ]() {
        const config = this.config( 'log.access-log' );
        const { format, createLogger } = winston;

        if( this.logging === false || this.logging === C.LOGGING_DISABLE || this.logging === C.LOGGING_DISABLE_ALL || !config ) {
            this.accessLogger = createLogger( {
                transports : [ new winston.transports.NULL ]
            } );
            return;
        }

        const transport = this[ YNN_PARSE_LOG_CONFIG_ITEM ]( 'info', config );
        this.accessLogger = createLogger( {
            format : format.printf( info => info.message ),
            transports : [ transport ]
        } );
    }

    async [ INIT_RSC_LOGGER ]() {
        const config = this.config( 'log.rsc-log' );
        const { format, createLogger } = winston;
        if( this.logging === false || this.logging === C.LOGGING_DISABLE || this.logging === C.LOGGING_DISABLE_ALL || !config ) {
            this.rscLogger = createLogger( {
                transports : [ new winston.transports.NULL ]
            } );
            return;
        }
        const transport = this[ YNN_PARSE_LOG_CONFIG_ITEM ]( 'info', config );
        this.rscLogger = createLogger( {
            format : format.printf( info => info.message ),
            transports : [ transport ]
        } );
    }

    /**
     * init the routers 
     */
    async _initRouter() {
        this.router = new Router( this, ( matches, ctx, next, rt ) => {
            if( !this.listenerCount( 'error' ) ) this.on( 'error', this.onerror );

            if( is.class( matches ) ) {
                return this[ EXECUTE_MIDDLEWARE ]( matches, ctx, next, rt ); 
            }

            const runtime = new Runtime( ctx, {
                console : this.console
            } );

            if( matches && matches.ynnMounting ) {
                const module = matches.module; 
                const m = this.modules[ module ];

                if( !m ) {
                    this.logger.error( `Module ${module} not exists.`, matches );
                    runtime.throw( 404 );
                    return;
                }
                const ins = m.instance;
                const ds = ins.middleware ? compose( ins.middleware ) : ins;
                ctx.app = ins;
                return ds( ctx ).then( value => {
                    ctx.app = this;
                    return value;
                } );
            } else {
                const dist = {};
                /**
                 * supporting "controller.action"
                 * eg. user.login user.index, user
                 */
                if( is.string( matches ) ) {
                    const [ c, a= 'index' ] = matches.replace( /\$([A-Za-z0-9_-]+)/g, ( m, n ) => {
                        if( /^\d+$/.test( n ) ) {
                            return ctx.routerMatches[ n ] || m;
                        }
                        return ctx.params[ n ] || m;
                    } ).split( '.' );
                    dist.controller = c;
                    dist.action = a; 
                } else {
                    for( const attr of Object.keys( matches ) ) {
                        const i = matches[ attr ];
                        if( /^\$\d+$/.test( i ) ) {
                            dist[ attr ] = ctx.routerMatches[ i.substr( 1 ) ] || i;
                        } else {
                            dist[ attr ] = ctx.params[ i.substr( 1 ) ] || i;
                        }
                    } 
                }
                ctx.destination = dist;
                return this[ YNN_EXECUTE ]( ctx );
            }
        } );

        const routers = this.routers;
        let fn;
        if( !routers ) {
            const routersFile = path.resolve( this.root, 'routers.js' );
            if( fs.existsSync( routersFile ) ) {
                fn = require( path.resolve( this.root, 'routers.js' ) );
            }
        } else if( is.function( routers ) ) {
            fn = routers;
        } else if( is.string( routers ) ) {
            fn = require( path.resolve( this.root, routers ) );
        }

        fn && fn.call( this, this );
    }

    async _afterinit() {

        if( this.static ) {
            for( const rule of Object.keys( this.static ) ) {
                let item = this.static[ rule ];

                if( is.string( item ) ) {
                    item = { path : item };
                }
                this.router.get( rule, serve( path.resolve( this.root, item.path ), item || {} ) );
            }
        }

        /**
         * to add router rules for mounting each modules
         */
        const modules = Object.keys( this.modules );

        for( const module of modules ) {
            const rules = [ `/${module}/(.*)`, `/${module}` ];
            if( this.modules[ module ].default ) rules.push( '/' );
            this.router.mount( rules, ctx => {
                if( !ctx.ynnOriginalPath ) {
                    ctx.ynnOriginalPath = ctx.path || '/';
                }
                if( !ctx.ynnTrack ) {
                    ctx.ynnTrack = [];
                }
                const path = ctx.path.replace( /^\/[^/]+/, '' ) || '/';
                ctx.ynnTrack.push( {
                    module : this,
                    step : module,
                    path
                } );
                return { module, path };
            } );
        }

        /**
         * to add rules for /controller/action, /controller/{default action}, /{default controller}/{default action}
         */
        this.router.add( [ '/:c/:a', '/:c', '/' ], ctx => ( {
            controller : ctx.params.c || 'index',
            action : ctx.params.a || 'index'
        } ) );

        this[ INIT_PLUGINS ]();
    }

    async [YNN_EXECUTE]( ctx ) {
        const runtime = new Runtime( ctx, {
            console : this.console
        } );

        const rules = ctx.destination;
        const { controller = 'index', action = 'index' } = rules;
        const Controller = this.controllers[ controller ];

        if( !Controller ) {
            this.logger.error( `Controller "${controller}" is not loaded.` );
            runtime.throw( 404 );
        }

        const c = new Controller( ctx, {
            controllerName : controller
        } );

        await c.ready();

        const func = c[ action + 'Action' ];

        if( is.function( func ) ) {
            try {
                const data = await func.call( c );
                if( !is.undefined( data ) ) {
                    return runtime.response( data );
                }
            } catch( e ) {
                runtime.throw( e );
            }
        } else {
            runtime.throw( 404 );
        }

        if( !is.undefined( func ) ) return func;
        runtime.throw( 404 );
    }

    async [ EXECUTE_MIDDLEWARE ]( MW, ctx, next ) {
        const mw = new MW( ctx, next );
        await mw.ready();
        if( !is.function( mw.execute ) ) return;
        const res = mw.execute( ctx, next );
        if( !is.undefined( res ) ) {
            return mw.response( res );
        }
    }

    use( fn, originalUse = false ) {
        if( originalUse ) return super.use( fn );

        return super.use( async ( ctx, next ) => {
            const rt = new Runtime( ctx );
            try {
                if( is.class( fn ) ) {
                    return await this[ EXECUTE_MIDDLEWARE ]( fn, ctx, next );
                }
                return await fn( ctx, next, rt );
            } catch( e ) {
                this.emit( 'exception', e, ctx, rt );
                if( is.function( this.onexception ) ) {
                    return this.onexception( e, ctx, rt );
                }
                throw e;
            }
        } );
    }

    preuse( middleware ) {
        preuse( this, middleware );
    }

    sham( url, options, callback ) {
        if( is.function( options ) ) {
            callback = options;
            options = {};
        }

        options || ( options = {} );

        if( is.undefined( options.promise ) ) {
            options.promise = true;
        }

        return sham( this, url, options, callback );
    }

    config( path, defaultValue ) {
        let res;
        for( const config of this.configs ) {
            res = config.get( path );
            if( !is.undefined( res ) ) return res;
        }
        return is.undefined( res ) ? defaultValue : res;
    }

    service( ctx, name, options = {} ) {
        if( !ctx ) {
            ctx = this;
        } else if( !is.object( ctx ) ) {
            options = name;
            name = ctx;
            ctx = this;
        }
        
        const Service = this.services[ name ];

        if( !Service ) {
            this.output.error( `Service ${name} not exists`, options );
        }

        return new Service( ctx, Object.assign( {
            serviceName : name
        }, options ) );
    }

    toJSON() {
        let configItems = new Set(); 
        for( const item of this.configs ) {
            configItems = new Set( [ ...configItems, ...Object.keys( item.config ) ] );
        }
        configItems = Array.from( configItems );

        return {
            isModule : this.isModule,
            name : this.name || null,
            'log-path' : this[ 'log-path' ],
            modules : Object.keys( this.modules || {} ),
            configs : configItems,
            controllers : Object.keys( this.controllers ),
            services : Object.keys( this.services ),
            plugins : Object.keys( this.plugins || {} ),
            port : this[ YNN_PORT ] || null,
            uds : this[ YNN_UDS ] || null
        };
    }

    find( path ) {
        if( !is.array( path ) ) {
            path = path.replace( /(^\/+)|(\/+$)/g, '' ).split( '/' );
        }

        let module = this;

        for( const name of path ) {
            const item = module.modules[ name ];
            if( !item ) return null;
            module = item.instance;
        }

        return module;
    }

    sibling( name ) {
        return this.parent.find( name );
    }
}

Object.assign( Ynn.prototype, {
    _initControllers : require( './controllers' ),
    _initServices : require( './services' ),
    _initModules : require( './modules' ),
    _initRSC : require( './rsc' ),
    [ INIT_CONFIG ] : require( './config' ),
    [ INIT_PLUGINS ] : require( './plugins' )
} )

Ynn.cargs = cargs;
Object.assign( Ynn, C );
module.exports = Ynn;
