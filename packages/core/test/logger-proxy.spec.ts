/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: test/logger-proxy.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/22/2020
 * Description: 
 ******************************************************************/

import loggerProxy from '../src/logger-proxy';
import DebugLogger from '../src/debug';

describe( 'logger-proxy', () => {

    it( 'logging is false', () => {
        
    } );

    it( 'logging is true', () => {
        
    } );
    
    it( 'debugging is false', () => {
        const debug = new DebugLogger();
        debug.error = jest.fn();
        const logger = loggerProxy( { debug, logging : false } );

        logger.log( '' );
        expect( debug.error ).toHaveBeenCalled();
    } ); 

    it( 'debugging is ture', () => {
        
    } );

    it( 'logger is set', () => {
        
    } );

    it( 'logger is unset', () => {
        
    } );

} );
