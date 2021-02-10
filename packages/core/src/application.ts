/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/application.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/02/2021
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import is from '@lvchengbin/is';
import { Context } from '@ynn/common';
import {
    createInterceptorBefore,
    createInterceptorAfter,
    createInterceptorParameter,
    createInterceptorException
} from '@ynn/method-interceptor';
import cargs from './cargs';
import Router, { RouterRule } from './router';
import Module from './module';
import Controller from './controller';
import { scan, ActionInfo } from './action';

export interface Options {
    modules?: Record<string, Module>;
    controllers?: Record<string, Controller>;
    providers?: Record<string, unknown>;
    routers?: RouterRule[] | ( ( this: Application, router: Router, app: Application ) => void );
}

export default class Application {
    static cargs = cargs;

    modules: NonNullable<Options[ 'modules' ]>;

    controllers: NonNullable<Options[ 'controllers' ]>;

    router: Router;

    actions: Record<string, Record<string, { info: ActionInfo; executor: ( ctx: Context ) => unknown }>>;

    #options: Options;

    constructor( options: Readonly<Options> = {} ): void {
        this.#setup( options );
        this.#setupRouters();
        this.#setupModules();
        this.#setupControllers();
        this.#setupProviders();
        this.modules = { ...options.modules };
        this.controllers = { ...options.controllers };
        this.#setupRouter();
    }

    #setup = ( options: Readonly<Options> ): void => {
        this.#options = { ...options, ...cargs };
    };

    #setupRouter = (): void => {
        const router = new Router();

        if( typeof this.#options.routers === 'function' ) {
            /**
             * if `options.routers` is a function, call the function with the Router instance and App instance.
             */
            this.#options.routers.call( this, router, this );
        } else {
            /**
             * call `router.any` with given rules in `options.routers` if it's an array.
             */
            this.#options.routers.forEach( ( rule: RouterRule ): void => {
                router.any( ...rule );
            } );
        }

        this.router = router;
    };

    // #setupModules = (): void => {};

    #setupControllers = (): void => {
        const { controllers } = this.#options;
        const { actions } = this;

        Object.keys( controllers ).forEach( ( controllerName: string ): void => {
            const Controller = controllers[ controllerName ];

            if( is.class( Controller ) ) {
                const actionInfos = scan( Controller.prototype );
                Object.keys( actionInfos ).forEach( ( actionName: string ) => {

                    const info = actionInfos[ actionName ];
                    const { descriptor } = info;

                    if( !actions[ controllerName ] ) { // eslint-disable-line @typescript-eslint/no-unnecessary-condition
                        actions[ controllerName ] = {};
                    }

                    const before = createInterceptorBefore( descriptor );
                    const after = createInterceptorAfter( descriptor );
                    const exception = createInterceptorException( descriptor );
                    const parameter = createInterceptorParameter( info.proto, info.methodName );

                    const executor = async ( context: Context ): Promise<unknown> => {
                        try {
                            await before( context );
                            const controller = new Controller( context );
                            const params = await parameter( context );
                            const response = controller[ actionName ]( ...params );
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

    // listen(): void {}

    // handler(): void {}
}
