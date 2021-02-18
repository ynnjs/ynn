/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/logger-proxy.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/21/2020
 * Description:
 ******************************************************************/

import { Logger, LogFunction } from '@ynn/common';

export type LoggerProxyOptions<T = Logger> = {
    debugging: boolean | string[];
    logging: boolean | string[];
    logger?: T;
    debug: T;
};

export default function loggerProxy<T extends Logger>( options: Readonly<LoggerProxyOptions<T>> ): T {

    const blank = (): void => {}; // eslint-disable-line @typescript-eslint/no-empty-function

    return new Proxy<T>( options.logger ?? options.debug, {

        get( target: Logger, method: string ): LogFunction {

            if( typeof target[ method ] !== 'function' ) return target[ method ];

            const { debugging, logging, logger, debug } = options;

            let fn;

            if( logging === true || ( Array.isArray( logging ) && logging.includes( method ) ) ) {
                if( typeof logger?.[ method ] === 'function' ) {
                    fn = logger[ method ].bind( logger );
                } else {
                    debugging && debug.error( `Function "${method}" not exists in logger.` );
                    fn = blank;
                }
            } else fn = blank;

            if( debugging === false || ( Array.isArray( debugging ) && !debugging.includes( method ) ) ) return fn;

            return ( ...args: Parameters<LogFunction> ): void => {
                fn( ...args );

                if( typeof debug[ method ] === 'function' ) {
                    debug[ method ]( ...args );
                } else if( typeof debug[ method ] === 'undefined' ) {
                    debug.log( ...args );
                }
            };
        }
    } );
};
