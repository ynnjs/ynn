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
    [ key: string ]: any;
}

export default class Ynn extends Koa {
    public static cargs = cargs;
    public logger: Proxy;
    public debug: DebugLogger;

    #logger = ( options: YnnOptions ): void => {
        const app = this; /* eslint-disable-line @typescript-eslint/no-this-alias */
        const { logger, logging, debugging } = options;

        this.logger = new Proxy( {}, {
            get( o: Record<any, any>, x: any ): ( ...args: any[] ) => any {
                if( !debugging && ( !logging || ( logging && !logger ) ) ) return () => {};
                const lfn = typeof logger[ x ] === 'function' ? logger[ x ].bind( logger ) : ( () => {} );
                if( !debugging ) return lfn;
                return ( ...args: any[] ): void => {
                    lfn( ...args );
                    typeof app.debug[ x ] === 'function' ? app.debug[ x ]( ...args ) : app.debug.log( ...args );
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
}

export default Ynn;
