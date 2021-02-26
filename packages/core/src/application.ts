/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/application.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/10/2021
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import path from 'path';
import Events from 'events';
import http, { Server } from 'http';
import { Argv } from 'yargs';
import is from '@lvchengbin/is';
import { Logger, HttpException } from '@ynn/common';
import { VariadicClass } from '@ynn/utility-types';
import { createInterceptorBefore, createInterceptorAfter, createInterceptorParameter, createInterceptorException, getMetadataParameter } from '@ynn/method-interceptor';
import Context, { ContextOptions } from './context';
import { scan, ActionInfo } from './action';
import Router, { RouterRule, RouteMap } from './router';
import cargs from './cargs';
import loggerProxy from './logger-proxy';
import { respond } from './util/respond';
import { fillParams } from './util/fill-params';
import Debug, { DebugOptions } from './debug';

const CWD = process.cwd();

const DEFAULT_CONTROLLER = 'index';
const DEFAULT_ACTION = 'index';

interface Providers {
    [ key: string ]: unknown; // VariadicClass | VariadicFunction | Providers;
}

export interface Options {
    root?: string;
    controllers?: Record<string, VariadicClass>;
    providers?: Providers;
    routers?: RouterRule[] | ( ( this: Application, router: Router, app: Application ) => void );
    logger?: Logger;
    debug?: Logger;
    debugOptions?: DebugOptions;
    debugging?: boolean;
    proxy?: boolean;
    maxIpsCount?: number;
}

export default class Application extends Events {
    static cargs = cargs;

    options!: Readonly<Options>;
    debug!: Logger;
    logger!: Logger;
    router!: Router;
    proxy!: boolean;
    controllers!: Record<string, VariadicClass>;
    debugging: boolean | string[] = true;
    logging: boolean | string[] = false;
    maxIpsCount = 0;

    server?: Server;

    /**
     * require.main is undefined is such as interactive mode
     */
    root = require.main ? path.dirname( require.main.filename ) : CWD;

    /**
     * map for actions
     */
    actions: Record<string, Record<string, { info: ActionInfo; executor: ( ctx: Context ) => unknown }>> = {};

    protected parseCargs( cargs: Argv[ 'argv' ] ): Partial<Options> { // eslint-disable-line class-methods-use-this

        const options: Partial<Options> = {};

        if( 'port' in cargs ) {
            if( !is.integer( cargs.port ) ) throw new TypeError( '--port must be a integer' );
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

        if( 'root' in cargs ) {
            options.root = path.resolve( CWD, String( cargs.root ) );
        }

        // if( 'config-dir' in cargs ) {
        //     options[ 'config-dir' ] = path.resolve( CWD, cargs[ 'config-dir' ] );
        // }

        return options;
    }

    constructor( options: Readonly<Options> = {} ) {
        super();
        this.#setup( options );
        // this.#setupModules();
        // this.#setupProviders();
        // this.modules = { ...options.modules };
        // this.controllers = { ...options.controllers };
    }

    #setup = ( options: Readonly<Options> ): void => {
        this.#setupOptions( options );
        this.#setupDebug();
        this.#setupLogger();
        this.#setupRouter();
        this.#setupControllers();
        this.#setupActions();
    };

    #setupOptions = ( options: Readonly<Options> ): void => {
        this.options = { ...options, ...this.parseCargs( cargs ) };
    };

    #setupDebug = (): void => {
        const { options } = this;

        this.debug = options.debug ?? new Debug( {
            levels : options.debugging,
            ...options.debugOptions
        } );
    };

    #setupLogger = (): void => {
        this.logger = loggerProxy( this );
    };

    #setupRouter = (): void => {
        const router = new Router();

        if( typeof this.options.routers === 'function' ) {
            /**
             * if `options.routers` is a function,
             * call the function with the Router instance and Application instance.
             */
            this.options.routers.call( this, router, this );
        } else if( Array.isArray( this.options.routers ) ) {
            /**
             * call `router.any` with rules in `options.routers` if it's an array.
             */
            this.options.routers.forEach( ( rule: RouterRule ): void => {
                router.any( ...rule );
            } );
        }

        router.any( '*', [ '/:CONTROLLER/:ACTION', '/:CONTROLLER', '/' ], ( ctx: Context, params: Record<string, string> ) => ( {
            controller : params.CONTROLLER || DEFAULT_CONTROLLER,
            action : params.ACTION || DEFAULT_ACTION
        } ) );

        this.router = router;
    };

    #setupControllers = (): void => {
        this.controllers = { ...this.options.controllers };
    };

    #setupActions = (): void => {

        const { controllers, actions } = this;

        controllers && Object.keys( controllers ).forEach( ( controllerName: string ): void => {

            const Controller = controllers[ controllerName ];

            if( is.class( Controller ) ) {

                const actionInfos = scan( Controller.prototype );

                Object.keys( actionInfos ).forEach( ( actionName: string ) => {
                    const info = actionInfos[ actionName ];
                    const { descriptor, methodName, proto } = info;

                    if( !actions[ controllerName ] ) {
                        actions[ controllerName ] = {};
                    }

                    const before = createInterceptorBefore<[ Context ]>( descriptor );
                    const after = createInterceptorAfter<[ Context ]>( descriptor );
                    const exception = createInterceptorException<[ Context ]>( descriptor );

                    const parameter = createInterceptorParameter<[ Context ]>( proto, methodName );
                    const metadataParameter = getMetadataParameter( proto, methodName );
                    const paramtypes = Reflect.getMetadata( 'design:paramtypes', proto, methodName );

                    const constructorParameter = createInterceptorParameter<[ Context ]>( Controller );
                    const constructorMetadataParameter = getMetadataParameter( Controller );
                    const constructorParamtypes = Reflect.getMetadata( 'design:paramtypes', Controller );

                    const executor = async ( context: Context ): Promise<unknown> => {
                        try {
                            await before( context );

                            const constructorParams = await fillParams(
                                await constructorParameter( context ),
                                constructorMetadataParameter,
                                constructorParamtypes,
                                [ context ]
                            );

                            const controller = new Controller( ...constructorParams );

                            const params = await fillParams(
                                await parameter( context ),
                                metadataParameter,
                                paramtypes,
                                [ context ]
                            ) ;

                            const response = controller[ methodName ]( ...params );

                            return await after( response, context );
                        } catch( e: unknown ) {
                            return exception( e, context );
                        }
                    };

                    actions[ controllerName ][ actionName ] = { info, executor };
                } );
            }
        } );
    };

    async handle( context: ContextOptions | Context ): Promise<Context> {

        const ctx: Context = context instanceof Context ? context : new Context( context );

        const match = this.router.match( ctx );

        if( match === false ) {
            ctx.status = 404;
        } else {
            const { rule, params, matches } = match;
            const result: RouteMap = {};
            let [ , , dest ] = rule;

            /**
             * bind params and matches to ctx
             */
            Object.assign( ctx, { params, matches } );

            if( typeof dest === 'function' ) {
                const res = await dest.call( this.router, ctx, params, matches );
                if( res ) dest = res;
            } else if( Array.isArray( dest ) ) {
                let res;
                for( const item of dest ) {
                    res = await item.call( this.router, ctx, params, matches ); // eslint-disable-line no-await-in-loop
                }
                if( res ) dest = res;
            }

            if( typeof dest === 'string' ) {
                const [ controller, action = DEFAULT_CONTROLLER ] = dest.replace( /\$([A-Z-a-z-0-9_-]+)/g, ( m, n ) => {
                    return ( /^\d+$/.test( n ) ? matches[ n ] : params[ n ] ) || m;
                } ).split( '.' );
                Object.assign( result, { controller, action } );
            } else {
                Object.assign( result, dest );
            }

            if( result.module ) {
                console.log( '~~~~~~~~~~~~~~~', result ); // eslint-disable-line
            } else {
                result.controller ??= DEFAULT_CONTROLLER;
                result.action ??= DEFAULT_ACTION;

                const action = this.actions[ result.controller ]?.[ result.action ];

                if( !action ) {
                    ctx.status = 404;
                } else {
                    try {
                        const body = await action.executor.call( this, ctx );
                        if( body !== undefined ) ctx.body = body;
                    } catch( e: unknown ) {
                        if( typeof e === 'number' ) {
                            ctx.status = e;
                        } else if( typeof e === 'string' ) {
                            ctx.status = 500;
                            ctx.message = e;
                        } else if( e instanceof HttpException ) {
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
        }
        return ctx;
    }

    listen( ...args: Parameters<Server[ 'listen' ]> ): Server {

        const server = http.createServer( async ( req, res ) => {
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
                respond( ctx, req, res );
                this.debug.debug( `[Ynn] ${ctx.ip} - - ${new Date} "${ctx.method}: ${ctx.url}" ${res.statusCode} ${( process.hrtime.bigint() - ctx.startTime ) / 1000000n}ms` );
            } catch( e: unknown ) {
                this.debug.log( `[Ynn] ${( e as any )?.message}` ); // eslint-disable-line @typescript-eslint/no-explicit-any
            }
        } );

        server.listen( ...args );

        const address = server.address();

        if( address && typeof address !== 'string' ) {
            this.logger.log( `Server is running on port ${ address.port }.` );
        } else {
            this.logger.log( `Server is running on ${address}.` );
        }

        return ( this.server = server );
    }

    toJSON(): Record<string, unknown> {
        return {
            controllers : this.controllers
        };
    }
}
