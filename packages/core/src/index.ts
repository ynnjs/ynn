/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: index.js
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 03/05/2020
 * Description: 
 ******************************************************************/

import Koa, { KoaOptions } from '@ynn/koa';
import cargs from './cargs';
import Logger from './logger';
import DebugLogger, { DebugLoggerOptions } from './debug';

export type YnnOptions = KoaOptions & {
    debugging?: boolean | keyof Logger | Array<keyof Logger>;
    debugOptions?: DebugLoggerOptions;
    logging?: boolean | string | string[];
    configDir?: string;
    logPath?: string;
    logger?: string | boolean | Logger;
    port?: number;
    [ key: string ]: any;
}

export default class Ynn extends Koa {
    public static cargs = cargs;
    public logger: Proxy;
    public debug: DebugLogger;

    #logger = ( options: YnnOptions ): void => {
        const { logger, logging, debugging } = options;
        const { debug } = this;

        this.logger = new Proxy( {}, {
            get( o: Record<any, any>, method: any ): ( ...args: any[] ) => any {
                /**
                 * if 
                 */
                if( !debugging && ( !logging || ( logging && !logger ) ) ) {
                    return () => {};
                }

                let fn;

                if( typeof logger[ method ] === 'function' ) {
                    fn = logger[ method ].bind( logger );
                } else {
                    debug.error( `Function "${method}" not exists in logger.` );
                    fn = () => {};
                }

                if( !debugging ) return fn;

                return ( ...args: any[] ): void => {
                    fn( ...args );
                    debug[ typeof debug[ method ] === 'function' ? method : 'log' ]( ...args );
                }
            }
        } );
    }

    #options: YnnOptions;

    #setup = ( options: YnnOptions ): void => {
        this.#options = { ...options, ...cargs };
        this.#logger( this.#options );
    }

    constructor( options: YnnOptions = {} ) {
        super();
        this.debug = new DebugLogger( options.debugOptions || {} );
        options = this.#setup( options );
    }

    listen() {
    }

    config() {
    }
}

export default Ynn;
