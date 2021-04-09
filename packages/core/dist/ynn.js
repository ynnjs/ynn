'use strict';
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/ynn.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 03/28/2021
 * Description:
 ******************************************************************/
var __classPrivateFieldGet = this && this.__classPrivateFieldGet || function( receiver, privateMap ) {
    if( !privateMap.has( receiver ) ) {
        throw new TypeError( 'attempted to get private field on non-instance' );
    }
    return privateMap.get( receiver );
};
var __importDefault = this && this.__importDefault || function( mod ) {
    return mod && mod.__esModule ? mod : { 'default' : mod };
};
var _setup, _setupOptions, _setupModule, _setupMountingPath, _setupDebug, _setupLogger, _setupRouter, _setupModules, _setupControllers, _setupActions;
Object.defineProperty( exports, '__esModule', { value : true } );
exports.Ynn = void 0;
require( 'reflect-metadata' );
const path_1 = __importDefault( require( 'path' ) );
const events_1 = __importDefault( require( 'events' ) );
const http_1 = __importDefault( require( 'http' ) );
const escape_string_regexp_1 = __importDefault( require( 'escape-string-regexp' ) );
const is_1 = __importDefault( require( '@lvchengbin/is' ) );
const context_1 = require( './context' );
const action_1 = require( './action' );
const router_1 = require( './router' );
const cargs_1 = __importDefault( require( './cargs' ) );
const http_exception_1 = require( './http-exception' );
const logger_proxy_1 = __importDefault( require( './logger-proxy' ) );
const respond_1 = require( './util/respond' );
const debug_1 = __importDefault( require( './debug' ) );
const module_1 = require( './module' );
const CWD = process.cwd();
const DEFAULT_CONTROLLER = 'index';
const DEFAULT_ACTION = 'index';

class Ynn extends events_1.default {
    constructor( options = {} ) {
        super();
        this.debugging = true;
        this.logging = false;
        this.maxIpsCount = 0;
        this.mountingPath = [];
        /**
         * require.main is undefined in for example interactive mode.
         */
        this.root = require.main ? path_1.default.dirname( require.main.filename ) : CWD;
        /**
         * map for action executors
         */
        this.executors = {};
        _setup.set( this, ( options ) => {
            __classPrivateFieldGet( this, _setupOptions ).call( this, options );
            __classPrivateFieldGet( this, _setupModule ).call( this );
            __classPrivateFieldGet( this, _setupMountingPath ).call( this );
            __classPrivateFieldGet( this, _setupDebug ).call( this );
            __classPrivateFieldGet( this, _setupLogger ).call( this );
            __classPrivateFieldGet( this, _setupRouter ).call( this );
            __classPrivateFieldGet( this, _setupControllers ).call( this );
            __classPrivateFieldGet( this, _setupModules ).call( this );
            __classPrivateFieldGet( this, _setupActions ).call( this );
        } );
        _setupOptions.set( this, ( options ) => {
            this.options = { ...options, ...this.parseCargs( cargs_1.default ) };
            this.debugging = this.options.debugging ?? true;
            this.logging = this.options.logging ?? false;
        } );
        _setupModule.set( this, () => {
            this.options.module && ( this.module = this.options.module );
        } );
        _setupMountingPath.set( this, () => {
            this.mountingPath = [ ...this.options.mountingPath ?? [], this ];
        } );
        _setupDebug.set( this, () => {
            const { options } = this;
            this.debug = options.debug ?? new debug_1.default( {
                levels : this.debugging,
                ...options.debugOptions
            } );
        } );
        _setupLogger.set( this, () => {
            this.logger = logger_proxy_1.default( {
                logger : this.options.logger,
                debug : this.debug,
                logging : this.logging,
                debugging : this.debugging
            } );
        } );
        _setupRouter.set( this, () => {
            const router = new router_1.Router();
            if( typeof this.options.routers === 'function' ) {
                /**
                 * if `options.routers` is a function,
                 * call the function with the Router instance and Ynn instance.
                 */
                this.options.routers.call( this, router, this );
            } else if( Array.isArray( this.options.routers ) ) {
                /**
                 * call `router.any` with rules in `options.routers` if it's an array.
                 */
                this.options.routers.forEach( ( rule ) => {
                    router.any( ...rule );
                } );
            }
            router.any( '*', [ '/' ], {} );
            this.router = router;
        } );
        _setupModules.set( this, () => {
            this.modules = {};
            const { modules } = this.options;
            modules && Object.keys( modules ).forEach( ( name ) => {
                this.modules[ name ] = Ynn.create( modules[ name ], {
                    mountingPath : this.mountingPath,
                    proxy : this.proxy,
                    maxIpsCount : this.maxIpsCount,
                    debugging : this.debugging,
                    logging : this.logging
                } );
                this.router.any( '*', new RegExp( `^/${escape_string_regexp_1.default( name )}(/.*)?` ), ( ctx ) => {
                    ctx.path = ctx.path.slice( name.length + 1 );
                    return { module : name };
                } );
            } );
        } );
        _setupControllers.set( this, () => {
            this.controllers = { ...this.options.controllers };
            Object.keys( this.controllers ).forEach( ( name ) => {
                this.router.any( '*', [ `/${name}/:ACTION`, `/${name}` ], ( ctx, params ) => {
                    return {
                        controller : name,
                        action : params.ACTION
                    };
                } );
            } );
        } );
        _setupActions.set( this, () => {
            this.controllers && Object.keys( this.controllers ).forEach( ( controllerName ) => {
                this.executors[ controllerName ] = action_1.createExecutors( this.mountingPath, this.controllers[ controllerName ] );
            } );
        } );
        __classPrivateFieldGet( this, _setup ).call( this, options );
    }

    static create( moduleOrDescriptor, options = {} ) {
        let module;
        if( typeof moduleOrDescriptor === 'function' ) {
            module = moduleOrDescriptor;
            options = { ...options };
        } else {
            module = moduleOrDescriptor.module;
            options = { ...moduleOrDescriptor.options, ...options };
        }
        const metadata = module_1.getModuleMetadata( module );
        if( typeof options.modules === 'function' ) {
            options.modules = options.modules( metadata.modules );
        }
        if( typeof options.controllers === 'function' ) {
            options.controllers = options.controllers( metadata.controllers );
        }
        // const overrideOptions = {};
        // metadata.debugging ?? ( overrideOptions.debugging = options);
        return new Ynn( {
            ...metadata,
            ...options,
            module
        } );
    }

    parseCargs( cargs ) {
        const options = {};
        if( 'port' in cargs ) {
            if( !is_1.default.integer( cargs.port ) )
                throw new TypeError( '--port must be a integer' );
        }
        // if( 'debugging' in cargs ) {
        //     options.debuggings = is.generalizedTrue( cargs.debugging );
        // }
        // if( 'logging' in cargs ) {
        //     options.logging = is.generalizedTrue( cargs.logging );
        // }
        // if( 'log-path' in cargs ) {
        //     options[ 'log-path' ] = path.resolve( CWD, cargs[ 'log-path' ] );
        // }
        // if( 'config-dir' in cargs ) {
        //     options[ 'config-dir' ] = path.resolve( CWD, cargs[ 'config-dir' ] );
        // }
        return options;
    }

    async handle( context ) {
        const ctx = context instanceof context_1.Context ? context : new context_1.Context( context );
        const match = this.router.match( ctx );
        if( match === false ) {
            ctx.status = 404;
            return ctx;
        }
        const { rule, params, matches } = match;
        let result;
        let [ , , dest ] = rule;
        /**
         * bind params and matches to ctx
         */
        Object.assign( ctx, { params, matches } );
        if( typeof dest === 'function' ) {
            const res = await dest( ctx, params, matches );
            if( !res || res instanceof context_1.Context )
                return ctx;
            dest = res;
        }
        if( typeof dest === 'string' ) {
            const [ controller, action = undefined ] = dest.replace( /\$([A-Z-a-z-0-9_-]+)/g, ( m, n ) => {
                return ( /^\d+$/.test( n ) ? matches[ n ] : params[ n ] ) || m;
            } ).split( '.' );
            result = { controller, action };
        } else
            result = { ...dest };
        if( result.module ) {
            if( !this.modules[ result.module ] ) {
                ctx.status = 304;
            } else {
                return this.modules[ result.module ].handle( ctx );
            }
        } else {
            const executor = this.executors[ result.controller ?? DEFAULT_CONTROLLER ]?.[ result.action ?? DEFAULT_ACTION ];
            if( !executor ) {
                ctx.status = 404;
            } else {
                try {
                    const body = await executor.call( this, ctx );
                    if( body !== undefined )
                        ctx.body = body;
                } catch( e ) {
                    if( typeof e === 'number' ) {
                        ctx.status = e;
                    } else if( typeof e === 'string' ) {
                        ctx.status = 500;
                        ctx.message = e;
                    } else if( e instanceof http_exception_1.HttpException ) {
                        if( e.response ) {
                            ctx.body = e.response;
                            ctx.status = e.response.status;
                            ctx.message = e.response.error;
                        } else {
                            ctx.status = e.status;
                            ctx.message = e.message;
                        }
                    } else {
                        this.logger.error( e );
                        ctx.status = 500;
                    }
                }
            }
        }
        return ctx;
    }

    listen( ...args ) {
        const server = http_1.default.createServer( async ( req, res ) => {
            res.statusCode = 404;
            try {
                const ctx = await this.handle( {
                    request : {
                        req,
                        proxy : this.proxy,
                        maxIpsCount : this.maxIpsCount
                    },
                    response : { res },
                    logger : this.logger,
                    debug : this.debug
                } );
                respond_1.respond( ctx, req, res );
                // this.debug.debug( `[Ynn] ${ctx.ip} - - ${new Date} "${ctx.method}: ${ctx.url}" ${res.statusCode} ${( process.hrtime.bigint() - ctx.startTime ) / 1000000n}ms` );
            } catch( e ) {
                this.debug.log( `[Ynn] ${e?.message}` ); // eslint-disable-line @typescript-eslint/no-explicit-any
            }
        } );
        server.listen( ...args );
        const address = server.address();
        if( address && typeof address !== 'string' ) {
            this.logger.log( `Server is running on port ${address.port}.` );
        } else {
            this.logger.log( `Server is running on ${address}.` );
        }
        return this.server = server;
    }

    toJSON() {
        return {
            controllers : this.controllers,
            modules : this.modules
        };
    }
}
exports.Ynn = Ynn;
_setup = new WeakMap(), _setupOptions = new WeakMap(), _setupModule = new WeakMap(), _setupMountingPath = new WeakMap(), _setupDebug = new WeakMap(), _setupLogger = new WeakMap(), _setupRouter = new WeakMap(), _setupModules = new WeakMap(), _setupControllers = new WeakMap(), _setupActions = new WeakMap();
Ynn.cargs = cargs_1.default;
