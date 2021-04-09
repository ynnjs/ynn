'use strict';
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/logger-proxy.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/21/2020
 * Description:
 ******************************************************************/
Object.defineProperty( exports, '__esModule', { value : true } );
function loggerProxy( options ) {
    const blank = () => { }; // eslint-disable-line @typescript-eslint/no-empty-function
    const isArray = Array.isArray;
    return new Proxy( options.logger ?? options.debug, {
        get( target, method ) {
            if( typeof target[ method ] !== 'function' )
                return target[ method ];
            const { debugging, logging, logger, debug } = options;
            let fn;
            if( logging === true || isArray( logging ) && logging.includes( method ) ) {
                if( typeof logger?.[ method ] === 'function' ) {
                    fn = logger[ method ].bind( logger );
                } else {
                    debugging && debug.error( `Function "${method}" not exists in logger.` );
                    fn = blank;
                }
            } else
                fn = blank;
            if( debugging === false || isArray( debugging ) && !debugging.includes( method ) )
                return fn;
            return ( ...args ) => {
                fn( ...args );
                if( typeof debug[ method ] === 'function' ) {
                    debug[ method ]( ...args );
                } else if( typeof debug[ method ] === 'undefined' ) {
                    debug.log( ...args );
                }
            };
        }
    } );
}
exports.default = loggerProxy;

