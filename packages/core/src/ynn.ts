/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/ynn.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 03/28/2021
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import path from 'path';
import Events from 'events';
import http, { Server } from 'http';
import escapeStringRegexp from 'escape-string-regexp';
import { Argv } from 'yargs';
import is from '@lvchengbin/is';
import { VariadicClass } from '@ynn/utility-types';
import { Logger, LoggerService, MODULE_METADATA_KEY } from '@ynn/common';
import { HttpException } from '@ynn/exceptions';
import { Context, ContextOptions } from './context';
import { createExecutors, Executor } from './action';
import { Router, RouterRule, RouteMap } from './router';
import cargs from './cargs';
import { respond } from './util/respond';

const CWD = process.cwd();
const DEFAULT_CONTROLLER = 'index';
const DEFAULT_ACTION = 'index';

type Controllers = Record<string, VariadicClass>;

export type ModuleOverrideOptions = Omit<Options, 'controllers' | 'modules'> & {
    controllers?: Controllers | ( ( controllers: Controllers | undefined ) => Controllers );
    modules?: Modules | ( ( modules: Modules | undefined ) => Modules );
};

export interface ModuleDescriptor {
    module: VariadicClass;
    options: ModuleOverrideOptions;
};

type Modules = Record<string, VariadicClass | ModuleDescriptor>;

export interface Options {
    controllers?: Controllers;
    modules?: Modules;
    routers?: RouterRule[] | ( ( this: Ynn, router: Router, app: Ynn ) => void );
    logger?: Logger;
    logging?: boolean | ( keyof Logger )[];
    module?: VariadicClass;
    mountingPath?: Ynn[];
}

export class Ynn extends Events {
    static cargs = cargs;

    static create( moduleOrDescriptor: VariadicClass | ModuleDescriptor, options: ModuleOverrideOptions = {} ): Ynn {

        let module: VariadicClass;

        if( typeof moduleOrDescriptor === 'function' ) {
            module = moduleOrDescriptor;
            options = { ...options };
        } else {
            module = moduleOrDescriptor.module;
            options = { ...moduleOrDescriptor.options, ...options };
        }

        const metadata = Reflect.getMetadata( MODULE_METADATA_KEY, module );

        if( typeof options.modules === 'function' ) {
            options.modules = options.modules( metadata.modules );
        }

        if( typeof options.controllers === 'function' ) {
            options.controllers = options.controllers( metadata.controllers );
        }

        // const overrideOptions = {};

        return new Ynn( {
            ...metadata,
            ...( options as Options ),
            module
        } );
    }

    options!: Readonly<Options>;
    logger!: Logger;
    router!: Router;
    controllers!: Record<string, VariadicClass>;
    modules!: Record<string, Ynn>;
    logging: boolean | ( keyof Logger )[] = false;
    mountingPath: Ynn[] = [];

    /**
     * The related Module of current application instance.
     * only instances built on Modules have this property.
     */
    module?: VariadicClass;
    server?: Server;

    /**
     * require.main is undefined in for example interactive mode.
     */
    root = require.main ? path.dirname( require.main.filename ) : CWD;

    /**
     * map for action executors
     */
    executors: Record<string, Record<string, Executor>> = {};

    protected parseCargs( cargs: Argv[ 'argv' ] ): Partial<Options> { // eslint-disable-line class-methods-use-this

        const options: Partial<Options> = {};

        if( 'port' in cargs ) {
            if( !is.integer( cargs.port ) ) throw new TypeError( '--port must be a integer' );
        }

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

    constructor( options: Readonly<Options> = {} ) {
        super();
        this.#setup( options );
    }

    #setup = ( options: Readonly<Options> ): void => {
        this.#setupOptions( options );
        this.#setupModule();
        this.#setupMountingPath();
        this.#setupLogger();
        this.#setupRouter();
        this.#setupControllers();
        this.#setupModules();
        this.#setupActions();
    };

    #setupOptions = ( options: Readonly<Options> ): void => {
        this.options = { ...options, ...this.parseCargs( cargs ) };
        this.logging = this.options.logging ?? false;
    };

    #setupModule = (): void => {
        this.options.module && ( this.module = this.options.module );
    };

    #setupMountingPath = (): void => {
        this.mountingPath = [ ...( this.options.mountingPath ?? [] ), this ];
    };

    #setupLogger = (): void => {
        this.logger = this.options.logger ?? new LoggerService();
        // this.logger = loggerProxy(
        //     logger : this.options.logger,
        //     logging : this.logging
        // } );
    };

    #setupRouter = (): void => {
        const router = new Router();

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
            this.options.routers.forEach( ( rule: RouterRule ): void => {
                router.any( ...rule );
            } );
        }

        router.any( '*', [ '/' ], {} );

        this.router = router;
    };

    #setupModules = (): void => {
        this.modules = {};

        const { modules } = this.options;

        modules && Object.keys( modules ).forEach( ( name: string ) => {
            this.modules[ name ] = Ynn.create( modules[ name ], {
                mountingPath : this.mountingPath,
                logging : this.logging
            } );

            this.router.any( '*', new RegExp( `^/${escapeStringRegexp( name )}(/.*)?` ), ( ctx: Context ) => {
                ctx.request.path = ctx.request.path.slice( name.length + 1 );
                return { module : name };
            } );
        } );
    };

    #setupControllers = (): void => {
        this.controllers = { ...this.options.controllers };

        Object.keys( this.controllers ).forEach( ( name: string ) => {
            this.router.any( '*', [ `/${name}/:ACTION`, `/${name}` ], ( ctx: Context, params: Record<string, string> ) => {
                return {
                    controller : name,
                    action : params.ACTION
                };
            } );
        } );
    };

    #setupActions = (): void => {

        this.controllers && Object.keys( this.controllers ).forEach( ( controllerName: string ): void => {
            this.executors[ controllerName ] = createExecutors( this.mountingPath, this.controllers[ controllerName ] );
        } );
    };

    async handle( context: ContextOptions | Context ): Promise<Context> {

        const ctx: Context = context instanceof Context ? context : new Context( context );
        const { response } = ctx;

        const match = this.router.match( ctx );

        if( match === false ) {
            response.status = 404;
            return ctx;
        }

        const { rule, params, matches } = match;
        let result: RouteMap;
        let [ , , dest ] = rule;

        /**
         * bind params and matches to ctx
         */
        Object.assign( ctx, { params, matches } );

        if( typeof dest === 'function' ) {
            const res = await dest( ctx, params, matches );
            if( !res || res instanceof Context ) return ctx;
            dest = res;
        }

        if( typeof dest === 'string' ) {
            const [ controller, action = undefined ] = dest.replace( /\$([A-Z-a-z-0-9_-]+)/g, ( m, n ) => {
                return ( /^\d+$/.test( n ) ? matches[ n ] : params[ n ] ) || m;
            } ).split( '.' );
            result = { controller, action };
        } else result = { ...dest };

        if( result.module ) {
            if( !this.modules[ result.module ] ) { response.status = 304 } else {
                return this.modules[ result.module ].handle( ctx );
            }
        } else {
            const executor = this.executors[ result.controller ?? DEFAULT_CONTROLLER ]?.[ result.action ?? DEFAULT_ACTION ];

            if( !executor ) { response.status = 404 } else {
                try {
                    const body = await executor.call( this, ctx );
                    if( body !== undefined ) response.body = body;
                } catch( e: unknown ) {
                    if( typeof e === 'number' ) {
                        response.status = e;
                    } else if( typeof e === 'string' ) {
                        response.status = 500;
                        response.message = e;
                    } else if( e instanceof HttpException ) {
                        if( e.response ) {
                            response.body = e.response;
                            response.status = e.status;
                            response.message = e.error;
                        } else {
                            response.status = e.status;
                            response.message = e.message;
                        }
                    } else {
                        this.logger.error( e );
                        response.status = 500;
                    }
                }
            }
        }
        return ctx;
    }

    listen( ...args: Parameters<Server[ 'listen' ]> ): Server {

        const server = http.createServer( async ( req, res ) => {
            res.statusCode = 404;

            try {
                const ctx = await this.handle( {
                    request : { req },
                    response : { res },
                    logger : this.logger
                } );
                respond( ctx, req, res );
                // this.logger.info( `[Ynn] ${ctx.ip} - - ${new Date} "${ctx.method}: ${ctx.url}" ${res.statusCode} ${( process.hrtime.bigint() - ctx.startTime ) / 1000000n}ms` );
            } catch( e: unknown ) {
                this.logger.info( `[Ynn] ${( e as any )?.message}` ); // eslint-disable-line @typescript-eslint/no-explicit-any
            }
        } );

        server.listen( ...args );

        const address = server.address();

        if( address && typeof address !== 'string' ) {
            this.logger.info( `Server is running on port ${ address.port }.` );
        } else {
            this.logger.info( `Server is running on ${address}.` );
        }

        return ( this.server = server );
    }

    toJSON(): Record<string, unknown> {
        return {
            controllers : this.controllers,
            modules : this.modules
        };
    }
}
