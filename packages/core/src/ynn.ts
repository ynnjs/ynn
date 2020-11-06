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
import Koa, { KoaOptions } from '@ynn/koa';
import cargs from './cargs';
import Logger from './logger';
import Config from './config';
import DebugLogger, { DebugLoggerOptions } from './debug';
import loggerProxy from './logger-proxy';
import Router from './router';

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
    modules?: any[];
    routers?: ( ( ...args: any[] ) => any ) | Record<string, string | (( ...args: any[] ) => string)>;
    [ key: string ]: any;
}

export default class Ynn extends Koa {
    public static cargs = cargs;
    public server: Server | null = null;
    public debug!: Logger;
    public logger!: Logger | Record<string, any>;
    public router!: Router;

    #address: AddressInfo | null = null;
    #configs: Config[] = [];
    #controllers: any[] = [];
    #providers: any[] = [];

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
        }

        router.any( '*', /.*/, ( ctx, next ) => {
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
}
