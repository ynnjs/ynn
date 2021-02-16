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
import { AddressInfo } from 'net';
import http, { Server } from 'http';
import { Argv } from 'yargs';
import is from '@lvchengbin/is';
import Logger from '@ynn/common';
import { VariadicClass } from '@ynn/utility-types';
import { createInterceptorBefore, createInterceptorAfter, createInterceptorParameter, createInterceptorException } from '@ynn/method-interceptor';
import Context, { ContextOptions } from './context';
import { scan, ActionInfo } from './action';
import Router, { RouterRule, RouteMap } from './router';
import cargs from './cargs';
import respond from './util/respond';

const CWD = process.cwd();

const DEFAULT_CONTROLLER = 'index';
const DEFAULT_ACTION = 'index';

export interface Options {
    root?: string;
    controllers?: Record<string, VariadicClass>;
    providers?: Record<string, unknown>;
    routers?: RouterRule[] | ( ( this: Application, router: Router, app: Application ) => void );
    port?: number;
}

export default class Application extends Events {
    // static cargs = cargs;

    #address?: AddressInfo;

    options!: Readonly<Options>;

    debug?: Logger;

    router!: Router;

    controllers: Record<string, VariadicClass<[ Context ]>>;

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
            options.port = parseInt( cargs.port as string );
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
        this.#setupRouter();
        // this.#setupModules();
        this.#setupControllers();
        // this.#setupProviders();
        // this.modules = { ...options.modules };
        this.controllers = { ...options.controllers };
    }

    #setup = ( options: Readonly<Options> ): void => {
        this.options = { ...options, ...this.parseCargs( cargs ) };
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

        const { controllers } = this.options;
        const { actions } = this;

        controllers && Object.keys( controllers ).forEach( ( controllerName: string ): void => {

            const Controller = controllers[ controllerName ];

            if( is.class( Controller ) ) {

                const actionInfos = scan( Controller.prototype );

                Object.keys( actionInfos ).forEach( ( actionName: string ) => {
                    const info = actionInfos[ actionName ];
                    const { descriptor, methodName } = info;

                    if( !actions[ controllerName ] ) {
                        actions[ controllerName ] = {};
                    }

                    const before = createInterceptorBefore<[ Context ]>( descriptor );
                    const after = createInterceptorAfter<[ Context ]>( descriptor );
                    const exception = createInterceptorException<[ Context ]>( descriptor );
                    const parameter = createInterceptorParameter<[ Context ]>( info.proto, methodName );

                    const executor = async ( context: Context ): Promise<unknown> => {
                        try {
                            await before( context );
                            const controller = new Controller( context );
                            const params = await parameter( context );
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
                console.log( result );
            } else {
                result.controller ??= DEFAULT_CONTROLLER;
                result.action ??= DEFAULT_ACTION;

                const action = this.actions[ result.controller ]?.[ result.action ];

                if( !action ) {
                    ctx.status = 404;
                } else {
                    const body = await action.executor.call( this, ctx );
                    if( body !== undefined ) ctx.body = body;
                }
            }

        }

        return ctx;
    }

    listen( ...args: Parameters<Server[ 'listen' ]> ): Server {

        const server = http.createServer( async ( req, res ) => {
            const ctx = await this.handle( { request : { req }, response : { res }, app : this } );
            respond( ctx, req, res );
        } );

        server.listen( ...args );

        const address = server.address();

        this.#address = address;

        this.logger.log( `Server is running on port ${ address.port }.` );

        return ( this.server = server );
    }
}
