/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/logger-proxy.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/21/2020
 * Description: 
 ******************************************************************/

import DebugLogger from './debug';
import Logger from './logger';

export type LoggerProxyOptions = {
    debugging?: boolean;
    logging?: boolean;
    logger?: Logger;
    debug: DebugLogger;
}

export default ( options: LoggerProxyOptions ) => {
    const { debugging = true, logging = false, logger, debug } = options;
    const blank = () => {};

    return new Proxy<any>( logger || {}, {
        get( logger: Logger, method: string ): ( ...args: any[] ) => any {
            if( !debugging && ( !logging || ( logging && !logger ) ) ) return blank;

            let fn;

            if( logging ) {
                if( typeof logger?.[ method ] === 'function' ) {
                    fn = logger[ method ].bind( logger );
                } else {
                    debugging && debug.error( `Function "${method}" not exists in logger.` );
                    fn = blank;
                }
            } else fn = blank;

            if( !debugging ) return fn;

            return ( ...args: any[] ): void => {
                fn( ...args );
                debug[ typeof debug[ method ] === 'function' ? method : 'log' ]( ...args );
            }
        }
    } );
}
