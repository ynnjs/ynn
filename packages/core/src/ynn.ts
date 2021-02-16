/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/ynn.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/26/2020
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import { AddressInfo } from 'net';
import { Server } from 'http';
import escapeRegexp from 'escape-string-regexp';
import is from '@lvchengbin/is';
import Koa, { compose, KoaOptions, KoaMiddleware, KoaContext } from '@ynn/koa';
import cargs from './cargs';
import Logger from './interfaces/logger.interface';
import Config from './config';
import DebugLogger, { DebugLoggerOptions } from './debug';
import loggerProxy from './logger-proxy';
import Router from './router';
import Controller from './controller';
import { scanner, generateExecutor, ActionInfo, ActionExecutor } from './action';

export type RouterTarget = {
    module?: string;
    controller?: string;
    action?: string;
};

export type RouterRule<
    M = string | RegExp | ( string | RegExp )[],
    T = string | RouterTarget | KoaMiddleware
> = [M, T] | [string | string[], M, T];

export type YnnController = KoaMiddleware | typeof Controller;

export type YnnOptions = KoaOptions & {
    debug?: Logger;
    debugging?: boolean;
    debugOptions?: DebugLoggerOptions;
    logging?: boolean;
    configDir?: string;
    logPath?: string;
    logger?: Logger;
    port?: number;
    controllers?: Record<string, YnnController>;
    providors?: Record<string, any>;
    modules?: Record<string, Koa>;
    routers?: RouterRule[] | ( ( ...args ) => void | RouterRule[] );
    isMoudule?: boolean;
    [ key: string ]: any;
};

export default class Ynn extends Koa {
    static cargs = cargs;

    server: Server | null = null;

    debug!: Logger;

    logger!: Logger | Record<string, any>;

    modules: Record<string, Koa>;

    router!: Router;

    isModule = false;

    controllers: NonNullable<YnnOptions[ 'controllers' ]>;
    // public providers: Record<string, any>;

    #address: AddressInfo | null = null;

    #configs: Config[] = [];

    #controllers: {
        controller: any;
        executor: ( ...args: any ) => void;
    };

    #setupDebug = ( options: YnnOptions ): void => {
        const opts = {
            levels : options.debugging,
            ...options.debugOptions
        };

        this.debug = options.debug || new DebugLogger( opts );
    };

    #setupLogger = ( options: YnnOptions ): void => {
        const { logger, logging = false, debugging = true } = options;

        this.logger = loggerProxy( {
            debug : this.debug,
            logging, debugging, logger
        } );
    };

    #options!: YnnOptions;

    #setupRouter = ( options: YnnOptions ): void => {
        const router = new Router( this );

        if( options.routers ) {
            let rules: RouterRule[] | void;

            if( typeof options.routers === 'function' ) {
                rules = options.routers( router, this );
            }

            rules && rules.forEach( ( rule: RouterRule ) => {
                if( rule.length === 2 ) {
                    rule = [ '*', ...rule ];
                }

                if( typeof rule[ 2 ] === 'function' ) {
                    router.any( ...( rule as Parameters<Router['any']> ) );
                    return;
                }

                let map: RouterTarget;

                if( typeof rule[ 2 ] === 'string' ) {
                    const [ action, controller, module ] = ( rule[ 2 ] as string ).split( '.' ).reverse();
                    map = { module, controller, action };
                } else {
                    map = { ...( rule[ 2 ] as RouterTarget ) };
                }

                router.any( rule[ 0 ], rule[ 1 ], async ( ctx, next ) => {
                    return this.execute( map, ctx, next );
                } );
            } );
        }

        this.modules && Object.keys( this.modules ).forEach( ( module: string ) => {
            const regexp = new RegExp( `^/${escapeRegexp( module )}(/|$)`, 'i' );
            router.any( '*', `/${module}/.*`, async ( ctx, next ) => {
                ctx.originalPath = ctx.path || '/';
                ctx.path = ctx.path.replace( regexp, '/' );
                const [ , controller, action ] = ctx.path.split( '/', 3 );
                return this.execute( { module, controller, action }, ctx, next );
            } );
        } );

        router.any( '*', /.*/, async ( ctx, next ) => {
            const [ , controller, action ] = ctx.path.split( '/', 3 );
            return this.execute( { controller, action }, ctx, next );
        } );

        this.router = router;
    };

    #setupControllers = ( options: YnnOptions ): void => {
        const { controllers } = options;

        /**
         * iterate all controllers for looking for actions of each controller.
         */
        Object.keys( controllers ).forEach( ( controllerName: string ) => {
            const Controller = controllers[ controllerName ];

            if( is.class( Controller ) ) {
                const actions = scanner( Controller.prototype );

                Object.keys( actions ).forEach( ( actionName: string ) => {
                    const actionInfo = actions[ actionName ];

                    /**
                     * generate executor for each action and register the executor to current app instance.
                     */
                    this.registerAction( `${controllerName}.${actionName}`, {
                        executor : generateExecutor( Controller, actionInfo )
                    } );
                } );
            }
        } );
    };

    #setup = ( options: YnnOptions ): void => {
        this.#options = { ...options, ...cargs };
        this.#setupDebug( this.#options );
        this.#setupLogger( this.#options );
        this.#setupRouter( this.#options );
    };

    constructor( options: YnnOptions = {} ) {
        super();
        this.isModule = !!options.isModule;
        this.modules = { ...options.modules };
        this.controllers = { ...options.controllers };
        this.#setup( options );
    }

    listen( ...args ): Server {
        if( this.#options.port ) {
            if( Number.isInteger( args[ 0 ] ) ) {
                args[ 0 ] = this.#options.port;
            } else {
                args.unshift( this.#options.port );
            }
        }
        this.server = super.listen( ...args );
        this.#address = ( this.server as Server ).address() as AddressInfo;
        this.debug.log( `Server is running on port ${( this.#address as AddressInfo ).port}` );
        return this.server as Server;
    }

    summary() {
        return {
            'log-path' : this.#options[ 'log-path' ],
            port : this.#address?.port ?? null
        };
    }

    config( path: string, defaultValue?: any ): any {
        let res;

        for( const config of this.#configs ) {
            res = config.get( path );
            if( res !== undefined ) return res;
        }
        return res === undefined ? defaultValue : res;
    }

    async execute( map: RouterTarget, ctx: KoaContext, next ): Promise<any> {
        const { module } = map;

        /**
         * if module is specified
         * upstream to target module if it is not an instance of Ynn but is an instance of Koa.
         * call module.execute if the module is an instance of Ynn.
         */
        if( module ) {

            const m = this.modules[ module ];

            if( !m ) {
                const msg = `module ${module} is not loaded.`;
                this.logger.error( msg );
                throw new Error( msg );
            }

            /**
             * change ctx.app to the target module
             */
            ctx.app = m;

            let res: Promise<any>;

            if( m instanceof Ynn ) {
                res = m.execute( {
                    controller : map.controller,
                    action : map.action
                } as RouterTarget, ctx, next );
            } else {
                const downstream = compose( m.middleware );
                res = downstream( ctx, next );
            }

            return res.then( value => {
                /**
                 * restore ctx.app to current instance
                 */
                ctx.app = this;
                return value;
            } );
        }

        const { controller = 'index' } = map;

        const C = this.controllers[ controller ];

        if( !C ) {
            const msg = `controller ${controller} is not loaded.`;
            this.logger.error( msg );
            throw new Error( msg );
        }

        if( is.class( C ) ) {
            const c = new ( C as typeof Controller )( ctx );
            const { action = 'index' } = map;
            const fn = c[ action + 'Action' ];

            ctx.routerTarget = { controller, action };

            if( typeof fn === 'function' ) {
                try {
                    const data = await fn.call( c, ctx );
                    if( data !== undefined ) {
                        ctx.body = data;
                    }
                } catch( e ) {
                    ctx.throw( e );
                }
            } else if( fn ) {
                ctx.body = fn;
            } else {
                ctx.throw( 404 );
            }
        } else if( typeof C === 'function' ) {
            ( C as KoaMiddleware )( ctx );
        } else {
            ctx.body = C;
        }
        return next();
    }
}
