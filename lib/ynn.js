const startTime = new Date;
const fs = require( 'fs' );
const path = require( 'path' );
const Koa = require( 'koa' );
const body = require( 'koa-bodyparser' );
const compose = require( 'koa-compose' );
const preuse = require( 'koa-preuse' );
const sham = require( 'koa-sham' );
const serve = require( 'koa-static' );
const winston = require( 'winston' );
const WinstonTransport = require( 'winston-transport' );
const Config = require( '@lvchengbin/config' );
const is = require( '@lvchengbin/is' );
const Router = require( './router' );
const Console = require( './console' );
const BaseMixin = require( './base-mixin' );
const RSC = require( './rsc' );
const utils = require( './utils' );
const loader = require( './loader' );
const Runtime = require( './runtime' );
const mounting = require( './mounting' );
const Boot = require( './boot' );
const cargs = require( './cargs' );
const C = require( './constants' );

require( 'winston-daily-rotate-file' );

const INIT_CONFIG = Symbol( 'init#config' );
const INIT_LOGGER = Symbol( 'init#logger' );
const INIT_PLUGINS = Symbol( 'init#plugins' );
const INIT_ACCESS_LOGGER = Symbol( 'init#access#logger' );
const YNN_KEYS = Symbol( 'ynn#keys' );
const YNN_EXECUTE = Symbol( 'ynn#execute' );
const YNN_REQUEST_BOOT = Symbol( 'ynn#request#boot' );
const YNN_ACCESS_LOG = Symbol( 'ynn#access#log' );
const YNN_PORT = Symbol.for( 'ynn#port' );
const YNN_PARSE_LOG_CONFIG_ITEM = Symbol( 'ynn#parse#log#config#item' );
const YNN_INTERACTIVE_MODE = Symbol( 'ynn#interactive#mode' );

function transconf( config, app ) {
    for( const prop in config ) {
        const item = config[ prop ];
        is.function( item ) && ( config[ prop ] = item( app ) );
    } 
    return config;
}

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

        Object.assign( this, options );
        this.is_ynn_app_instance = true;
        this.console = new Console( this );

        this.configs = [];
        this.controllers = {};
        this.services = {};

        this.isModule = !!mounting.status;

        if( this.isModule ) {
            if( !this.root ) {
                this.root = path.dirname( mounting.path );
            }
            this.name = mounting.name;
            this.parent = mounting.parent;
            this.top = this.parent.top;
            this.logDir = mounting.logDir;
            this.paths = [];
            let app = this;
            if( mounting.logging === C.LOGGING_DISABLE_ALL ) {
                this.logging = mounting.logging;
            }
            while( app.name ) {
                this.paths.unshift( app.name );
                app = app.parent;
            }
        } else {
            this.top = this;
            if( !this.root ) {
                this.root = path.dirname( require.main.filename );
            }
            this.logDir = path.resolve( this.root, this.logDir || 'log' );
        }
        this.configDir = path.resolve( this.root, this.configDir || 'config' );
        this[ INIT_CONFIG ]();

        winston.transports.NULL = class extends WinstonTransport{ log() {} };
        if( !this.logger ) {
            this[ INIT_LOGGER ]();
        }
        this[ INIT_ACCESS_LOGGER ]();

        if( !this.isModule ) {
            this.use( RSC.middleware() );
            this.use( body( { multipart : true } ) );
            this.use( this[YNN_ACCESS_LOG]() );
            this[ YNN_INTERACTIVE_MODE ]();
        }
    }

    listen( port ) {

        /**
         * the port that specified in command line will override the argument.
         */
        if( cargs.hasOwnProperty( 'port' ) ) {
            port = cargs.port;
        }

        const listen = super.listen( port );

        this[ YNN_PORT ] = listen.address().port;

        this.ready( () => {

            const info = this.toJSON();

            this.console.spec( Array( 72 ).join( '-' ) );
            this.console.spec( 'Application is ready.' );
            this.console.spec( `Logs: ${this.logDir}` );
            this.console.spec( `Configs: [ ${info.configs.join( ', ' )} ].` );
            this.console.spec( `Boot File: ${info.boot?'boot.js':null}` );
            this.console.spec( `Modules: [ ${info.modules.join( ', ' )} ].` );
            this.console.spec( `Controllers: [ ${info.controllers.join( ', ' )} ].` );
            this.console.spec( `Services: [ ${info.services.join( ', ' )} ].` );
            this.console.spec( `Plugins: [ ${info.plugins.join( ', ' )} ].` );
            this.console.spec( `Port: ${this[YNN_PORT]} - http://127.0.0.1:${this[YNN_PORT]}.` );
            this.console.spec( `Date: ${new Date}.` );
            this.console.spec( `Time: ${new Date - startTime}ms.` );
            this.console.spec( `Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024 ).toFixed(2)}MB.` );
            this.console.spec( Array( 72 ).join( '-' ) );
        } );
        return listen;
    }

    [ YNN_INTERACTIVE_MODE ]() {
        if( !cargs[ 'allow-interactive' ] ) return;
        const interactive = require( './interactive' )( this );
        if( cargs.interactive ) {
            interactive.start();
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
            const { res, req, request, response } = ctx;
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

                const msg = [
                    `${request.ip} - - ${new Date}`,
                    `"${ctx.method}: ${ctx.ynnOriginalPath||request.path} ${request.protocol.toUpperCase()}/${req.httpVersion}"`,
                    `"${track}"`,
                    res.statusCode,
                    response.length,
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

    /**
     * [ mounting.config, mounting.configDir, app.config, ynn.config ]
     */
    [ INIT_CONFIG ]() {
        mounting.config && this.configs.push( new Config( mounting.config ) );
        /**
         * to load config files that specified while mounting the module
         */
        if( mounting.configDir ) {
            const config = this.loadFiles( mounting.configDir, ( fp, name ) => {
                return [ 'modules.js', 'plugins.js', 'app.js', 'rsc.js', 'log.js' ].indexOf( name ) === -1;
            } );
            if( config ) {
                this.configs.push( new Config( transconf( config, this ) ) );
            }
        }

        /**
         * to load the config files of the module
         */
        try {
            const config = this.loadFiles( this.configDir );
            if( config ) {
                this.configs.push( new Config( transconf( config, this ) ) );
            }
        } catch( e ) {
            this.console.error( e );
        }

        /**
         * to load the default config files of Ynn
         */
        const config = this.loadFiles( path.join( __dirname, 'config' ) );
        if( config ) {
            this.configs.push( new Config( transconf( config, this ) ) );
        }
    }

    [ YNN_PARSE_LOG_CONFIG_ITEM ]( level, config = {} ) {
        if( !config.level && !config.levels ) {
            config.level = level;
        }

        if( config.console ) {
            return new winston.transports.Console( config );
        }

        if( config.filename ) {
            config.filename = path.resolve( this.logDir, config.filename );
        }

        if( config.dailyrotate ) {
            return new winston.transports.DailyRotateFile( config );
        } else {
            return new winston.transports.File( config );
        }

    }

    async [ INIT_LOGGER ]() {
        /**
         * to init logger before initializing other parts
         */
        const config = this.config( 'log' );

        if( this.logging === C.LOGGING_DISABLE || this.logging === C.LOGGING_DISABLE_ALL || !config ) {
            this.logger = winston.createLogger( {
                transports : [ new winston.transports.NULL ]
            } );
            return;
        }
        const transports = [];

        for( const level in config ) {
            transports.push( this[ YNN_PARSE_LOG_CONFIG_ITEM ]( level, config[ level ] ) );
        }
        this.logger = winston.createLogger( { transports } );
    }

    async [ INIT_ACCESS_LOGGER ]() {
        const config = this.config( 'access-log' );
        const { format, createLogger } = winston;

        if( this.logging === C.LOGGING_DISABLE || this.logging === C.LOGGING_DISABLE_ALL || !config ) {
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

    async _initModules() {
        let modules = this.config( 'modules', {} );

        if( is.function( modules ) ) {
            modules = modules.call( this, this );
        }

        modules = Object.assign( {}, modules, this.modules || {} );

        for( const name in modules ) {
            let module = modules[ name ];

            if( is.string( module ) ) {
                module = { path : module };
                modules[ name ] = module;
            }

            if( !module.logDir ) {
                module.logDir = path.join( this.logDir, name );
            }

            if( module.configDir ) {
                module.configDir = path.resolve( this.root, module.configDir );
            }

            const c = module.path.charAt( 0 );

            const mountingData = {
                name,
                parent : this,
                config : module.config,
                configDir : module.configDir,
                logDir : module.logDir
            };

            if( this.logging === C.LOGGING_DISABLE_ALL ) {
                mountingData.logging = C.LOGGING_DISABLE_ALL;
            }

            // to load module from node_modules
            if( c !== '/' && c !== '.' ) {
                try {
                    mounting.set( Object.assign( {
                        path : require.resolve( module.path ),
                    }, mountingData ) );
                    this.console.log( module.path );
                    module.instance = require( module.path );
                } catch( e ) {
                    const msg = `Failed to load module "${name}" from "${module.path}".`;
                    this.logger.error( msg, {
                        error : e.message,
                        module
                    } );
                    throw e;
                }
            } else {
                let file = path.resolve( this.root, module.path );

                if( !fs.existsSync( file ) ) {
                    const msg = `module ${file} not exists.`;
                    this.logger.error( msg, {
                        module,
                        path : file
                    } );
                    throw new Error( msg );
                }

                // to concat 'index.js' to the module path for preventing that in some cases there is a js file has same file name with the module.
                if( utils.isdir( file ) ) {
                    file = path.join( file, 'index.js' );
                }

                try {
                    mounting.set( Object.assign( {
                        path : require.resolve( file ),
                    }, mountingData ) );
                    module.instance = require( file );
                } catch( e ) {
                    this.logger.error( `Failed to load module "${module}" from "${file}".`, {
                        error : e.message,
                        path : file,
                        module
                    } );
                    throw e;
                }
            }
            mounting.reset();
        }
        this.modules = modules;
        const promises = [];
        for( const name in modules ) {
            const ins = modules[ name ].instance;
            if( is.promise( ins ) ) {
                promises.push( ins );
            } else if( is.function( ins.ready ) ) {
                promises.push( ins.ready() );
            }
        }
        return Promise.all( promises );
    }

    [ INIT_PLUGINS ]() {
        let plugins = this.config( 'plugins', {} );

        if( is.function( plugins ) ) {
            plugins = plugins.call( this, this );
        }

        plugins = Object.assign( {}, plugins, this.plugins || {} );

        for( const name in plugins ) {
            let plugin = plugins[ name ];

            if( is.function( plugin ) ) {
                this[ name ] = plugin( this, { name } );
                continue;
            }

            if( is.string( plugin ) ) {
                plugin = { path : plugin };
            }

            if( !plugin.options ) {
                plugin.options = {};
            }

            if( !plugin.options.name ) {
                plugin.options.name = name;
            }

            const c = plugin.path.charAt( 0 );

            if( c === '.' || c === '/' ) {
                plugin.path = path.resolve( this.root, plugin.path );
            }

            try {
                let P = require( plugin.path );

                if( is.class( P ) ) {
                    plugin.instance = new P( this, plugin.options );
                } else if( is.function( P ) ) {
                    plugin.instance = P( this, plugin.options );
                } else {
                    this[ name ] = P;
                }
            } catch( e ) {
                this.logger.error( `Failed to load plugin "${name}".`, { error : e.message, plugin } );
                throw e;
            }
        }

        this.plugins = plugins;
        const promises = [];
        for( const name in plugins ) {
            const item = plugins[ name ].instance;
            if( is.promise( item ) ) {
                promises.push( item );
            } else if( item && is.function( item.ready ) ) {
                promises.push( item.ready() );
            }
        }
        return Promise.all( promises );
    }

    /**
     * init the routers 
     */
    async _initRouter() {
        this.router = new Router( this, ( matches, ctx ) => {
            if( !this.listenerCount( 'error' ) ) this.on( 'error', this.onerror );
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

        const boot = this[ YNN_REQUEST_BOOT ];
        if( is.class( boot ) ) {
            const ins = new boot( ctx );
            if( ins instanceof Boot ) {
                await ins.ready();
            }
        } else if( is.function( boot ) ) {
            await boot( ctx );
        }

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
        const func = c[ action + 'Action' ];

        if( is.function( func ) ) {
            try {
                const data = await func.call( c );
                if( !is.undefined( data ) ) {
                    return runtime.response( data );
                }
            } catch( e ) {
                this.emit( 'error', e, ctx );
                throw e;
            }
        } else {
            runtime.throw( 404 );
        }

        if( !is.undefined( func ) ) return func;
        runtime.throw( 404 );
    }

    async _initBoot() {
        const file = path.resolve( this.root, 'boot.js' );
        if( !fs.existsSync( file ) ) return;
        try {
            this[ YNN_REQUEST_BOOT ] = require( file );
        } catch( e ) {
            this.logger.error( '', Object.assign() );
            throw e;
        }
    }

    async _initControllers() {
        const dir = path.resolve( this.root, this.config( 'app.controller' ) || 'controller' );
        if( utils.isdir( dir ) ) {
            try {
                Object.assign( this.controllers, loader.files( dir ) );
            } catch( e ) {
                this.console.error( e );
                this.logger.error( 'Uncaught error while initializing controllers', Object.assign( this.inspect(), { error : e.message } ) );
            }
        }
    }

    async _initServices() {
        const dir = path.resolve( this.root, this.config( 'app.service' ) || 'service' );
        if( utils.isdir( dir ) ) {
            try {
                Object.assign( this.services, loader.files( dir ) ); 
            } catch( e ) {
                this.logger.error( 'Uncaught error while initializing services', Object.assign( this.inspect(), { error : e.message } ) );
                throw e;
            } 
        }
    }

    async _initRSC() {
        try {
            this.rsc = new RSC( this );    
        } catch( e ) {
            this.console.error( e );
            this.logger.error( 'Uncaught error while initializing RSC', Object.assign( this.inspect(), { error : e.message } ) );
        }
    }

    preuse( middleware ) {
        preuse( this, middleware );
    }

    sham( url, options, callback ) {
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

    toJSON() {
        let configItems = new Set(); 
        for( const item of this.configs ) {
            configItems = new Set( [ ...configItems, ...Object.keys( item.config ) ] );
        }
        configItems = Array.from( configItems );

        return {
            isModule : this.isModule,
            name : this.name || null,
            logDir : this.logDir,
            modules : Object.keys( this.modules || {} ),
            configs : configItems,
            boot : !!this[ YNN_REQUEST_BOOT ],
            controllers : Object.keys( this.controllers ),
            services : Object.keys( this.services ),
            plugins : Object.keys( this.plugins || {} ),
            port : this[ YNN_PORT ] || null,
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

Object.assign( Ynn, C );

module.exports = Ynn;
