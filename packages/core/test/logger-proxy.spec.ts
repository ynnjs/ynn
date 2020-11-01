/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: test/logger-proxy.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/01/2020
 * Description: 
 ******************************************************************/

import loggerProxy from '../src/logger-proxy';
import Debug from '../src/debug';

const loggerMethods = [ 'log', 'debug', 'warn', 'verbose', 'error', 'critical' ];
const debugMethods = [ 'log', 'debug', 'warn', 'verbose', 'error' ];

function mock( options: any = {} ) {
    const debug = new Debug;
    const logger = new Debug;
    debugMethods.forEach( x => debug[ x ] = jest.fn() );
    loggerMethods.forEach( x => logger[ x ] = jest.fn() );
    const proxy = loggerProxy( { logger, debug, ...options } )
    return { debug, logger, proxy }
}

describe( 'logger-proxy', () => {

    describe( 'supress both logging and debugging', () => {
        loggerMethods.forEach( x => {
            it( `${x}`, () => {
                const { logger, debug, proxy } = mock( { logging : false, debugging : false } );
                proxy[ x ]( '123' );
                expect( logger[ x ] ).toHaveBeenCalledTimes( 0 );
                expect( debug[ x === 'critical' ? 'log' : x ] ).toHaveBeenCalledTimes( 0 );
            } );
        } );
    } );

    describe( 'debugging only', () => {
        loggerMethods.forEach( x => {
            it( `${x}`, () => {
                const { logger, debug, proxy } = mock( { logging : false, debugging : true } );
                const str = new Date().toString();
                proxy[ x ]( str );
                expect( logger[ x ] ).toHaveBeenCalledTimes( 0 );
                expect( debug[ x === 'critical' ? 'log' : x ] ).toHaveBeenCalledTimes( 1 );
            } );
        } );
    } );

    describe( 'logging only', () => {
        loggerMethods.forEach( x => {
            it( `${x}`, () => {
                const { logger, debug, proxy } = mock( { logging : true, debugging : false } );
                const str = new Date().toString();
                proxy[ x ]( str );
                expect( logger[ x ] ).toHaveBeenCalledTimes( 1 );
                expect( debug[ x === 'critical' ? 'log' : x ] ).toHaveBeenCalledTimes( 0 );
            } );
        } );
    } );

    describe( 'no logger', () => {
        loggerMethods.forEach( x => {
            it( `${x}`, () => {
                const debug = new Debug;
                debugMethods.forEach( x => debug[ x ] = jest.fn() );
                const proxy = loggerProxy( { debug, debugging : true, logging : true } )
                const str = new Date().toString();
                proxy[ x ]( str );
                expect( debug[ x === 'critical' ? 'log' : x ] ).toHaveBeenCalledTimes( x === 'error' ? 2 : 1 );
            } );
        } );
    } );


    describe( 'extra and non-existent logger method', () => {
        it( 'supressed debugging', () => {
            const { logger, debug, proxy } = mock( { logging : true, debugging : false } );
            const str = new Date().toString();
            ( proxy as any ).xxx( str );
            expect( logger.log ).toHaveBeenCalledTimes( 0 );
            expect( debug.error ).toHaveBeenCalledTimes( 0 );
        } );

        it( 'debugging', () => {
            const { logger, debug, proxy } = mock( { logging : true, debugging : true } );
            const str = new Date().toString();
            ( proxy as any ).xxx( str );
            expect( logger.log ).toHaveBeenCalledTimes( 0 );
            expect( debug.error ).toHaveBeenCalledTimes( 1 );
            expect( debug.error ).toHaveBeenCalledWith( 'Function "xxx" not exists in logger.' );
            expect( debug.log ).toHaveBeenCalledTimes( 1 );
            expect( debug.log ).toHaveBeenCalledWith( str );
        } );
    } );

    describe( 'logging and debugging', () => {
        loggerMethods.forEach( x => {
            it( `${x}`, () => {
                const { logger, debug, proxy } = mock( { logging : true, debugging : true } );
                const str = new Date().toString();
                proxy[ x ]( str );
                expect( logger[ x ] ).toHaveBeenCalledTimes( 1 );
                expect( debug[ x === 'critical' ? 'log' : x ] ).toHaveBeenCalledTimes( 1 );
                expect( logger[ x ] ).toHaveBeenCalledWith( str );
                expect( debug[ x === 'critical' ? 'log' : x ] ).toHaveBeenCalledWith( str );
            } );
        } );
    } );
} );
