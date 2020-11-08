/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/ynn.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/26/2020
 * Description: 
 ******************************************************************/

import { AddressInfo } from 'net';
import { Server } from 'http';
import escapeRegexp from 'escape-string-regexp';
import is from '@lvchengbin/is';
import Koa, { compose, KoaOptions, KoaMiddleware, KoaContext } from '@ynn/koa';
import cargs from './cargs';
import Logger from './logger';
import Config from './config';
import DebugLogger, { DebugLoggerOptions } from './debug';
import loggerProxy from './logger-proxy';
import Router from './router';
import Controller from './controller';

export type RouterRuleMap = {
    module?: string;
    controller?: string;
    action?: string;
};

export type YnnController = Controller | KoaMiddleware;

export type RouterRule<
    M = string | RegExp | (string | RegExp)[],
    T = string | RouterRuleMap | KoaMiddleware
> = [M, T] | [string | string[], M, T]

export type YnnOptions = KoaOptions & {
    debug?: Logger;
    debugging?: boolean;
    debugOptions?: DebugLoggerOptions;
    logging?: boolean;
    configDir?: string;
    logPath?: string;
    logger?: Logger;
    port?: number;
    controllers?: any[];
    providors?: any[];
    modules?: Record<string, Koa>;
    routers?: RouterRule[] | ( ( ...args ) => void | RouterRule[] ),
    isMoudule?: boolean;
    [ key: string ]: any;
}

export default class Ynn extends Koa {
    public static cargs = cargs;
    public server: Server | null = null;
    public debug!: Logger;
    public logger!: Logger | Record<string, any>;
    public modules: Record<string, Koa>;
    public router!: Router;
    public isModule = false;
    public controllers: YnnController[] = [];
    public providers: any[] = [];

    #address: AddressInfo | null = null;
    #configs: Config[] = [];

    #setupDebug = ( options: YnnOptions ): void => {
        const opts = {
            levels : options.debugging,
            ...options.debugOptions
        };

        this.debug = options.debug || new DebugLogger( opts );
    }

    #setupLogger = ( options: YnnOptions ): void => {
        const { logger, logging = false, debugging = true } = options;

        this.logger = loggerProxy( {
            debug : this.debug,
            logging, debugging, logger
        } );
    }

    #options!: YnnOptions;

    #setupRouter = ( options: YnnOptions ): void => {
        const router = new Router( this );

        if( options.routers ) {
            let rules: RouterRule[] | void;

            if( typeof options.routers === 'function' ) {
                rules = options.routers( router, this );
            }

            rules && rules.forEach( ( rule : RouterRule ) => {
                if( rule.length === 2 ) {
                    rule = [ '*', ...rule ];
                }

                if( typeof rule[ 2 ] === 'function' ) {
                    router.any( ...( rule as Parameters<Router['any']> ) );
                    return;
                }

                let map: RouterRuleMap;

                if( typeof rule[ 2 ] === 'string' ) {
                    const [ controller, action ] = ( rule[ 2 ] as string ).split( '.' );
                    map = { controller, action };
                } else {
                    map = { ...( rule[ 2 ] as RouterRuleMap ) };
                }

                router.any( rule[ 0 ], rule[ 1 ], ( ctx, next ) => {
                    return this.execute( map, ctx, next );
                } );
            } );
        }

        this.modules && Object.keys( this.modules ).forEach( ( module: string ) => {
            const regexp = new RegExp( `^/${escapeRegexp(module)}(/|$)`, 'i' );
            router.any( '*', `/${module}/.*`, ( ctx, next ) => {
                ctx.originalPath = ctx.path || '/';
                ctx.path = ctx.path.replace( regexp, '/' );
                const [ , controller, action ] = ctx.path.split( '/', 3 );
                return this.execute( { module, controller, action }, ctx, next );
            } );
        } );

        router.any( '*', /.*/, ( ctx, next ) => {
            const [ , controller, action ] = ctx.path.split( '/', 3 ); 
            return this.execute( { controller, action },  ctx, next );         
        } );

        this.router = router;
    }

    #setup = ( options: YnnOptions ): void => {
        this.#options = { ...options, ...cargs };
        this.#setupDebug( this.#options );
        this.#setupLogger( this.#options );
        this.#setupRouter( this.#options );
    }

    constructor( options: YnnOptions = {} ) {
        super();
        this.isModule = !!options.isModule;
        this.modules = options.modules || {};
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
        }
    }

    config( path: string, defaultValue?: any ): any {
        let res;

        for( const config of this.#configs ) {
            res = config.get( path );
            if( res !== undefined ) return res;
        }
        return res === undefined ? defaultValue : res;
    }

    execute( map: RouterRuleMap, ctx: KoaContext, next ): Promise<any> {
        const { module } = map as any;

        /**
         * if module is specified
         * upstream to target module if it is not an instance of Ynn but is an instance of Koa.
         * call module.execute if the module is an instance of Ynn.
         */
        if( module ) {

            const m = this.modules[ module ];

            if( !m ) {
                this.logger.error( `module ${module} is not loaded.` );
                return;
            }

            ctx.app = m;

            let res: Promise<any>;

            if( m instanceof Ynn ) {
                res = m.execute( {
                    controller : map.controller,
                    action : map.action
                } as RouterRuleMap, ctx, next );
            } else {
                const downstream = compose( m.middware );
                res = downstream( ctx, next );
            }

            return res.then( value => {
                ctx.app = this;
                return value;
            } );
        }

        const { controller = 'index' } = map;

        const Controller = this.controllers[ controller ];

        if( !Controller ) {
            this.logger.error( `controller ${controller} is not loaded.` );
        }

        if( is.class( Controller ) ) {
            new Controller();
            return;
        }

        if( typeof Controller === 'function' ) {
            Controller( ctx );
        }

        return next();
    }
}
