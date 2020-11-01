/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: test/debug.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/01/2020
 * Description: 
 ******************************************************************/

import { mockProcessStdout } from 'jest-mock-process';
import escapeRegexp from 'escape-string-regexp';
import Debug from '../src/debug';
import Logger from '../src/logger';

const methods: Array<keyof Logger> = [ 'log', 'debug', 'error', 'warn', 'verbose' ];

describe( 'debug', () => {

    let mockStdout;

    beforeEach( () => {
        mockStdout = mockProcessStdout()
    } );

    afterEach( () => {
        mockStdout.mockRestore();
    } )

    describe( 'debug.log', () => {
        it( 'should print log without any styles', () => {
            const debug = new Debug( { styles : false } ); 

            const str = new Date().toString();
            debug.log( str );
            expect( mockStdout ).toHaveBeenCalledTimes( 1 );
            expect( mockStdout ).toHaveBeenCalledWith( str );
        } );
    } ); 

    methods.forEach( method => {

        describe( `debug.${method}`, () => {
            it( 'should print log without any styles', () => {
                const debug = new Debug( { styles : false } ); 

                const str = new Date().toString();
                debug.error( str );
                expect( mockStdout ).toHaveBeenCalledTimes( 1 );
                expect( mockStdout ).toHaveBeenCalledWith( str );
            } );

            it( 'should print log without any styles', () => {
                const debug = new Debug( {
                    styles : {
                        [ method ] : { color : 'grey' }
                    }
                } ); 

                const str = new Date().toString();
                debug.error( str );
                expect( mockStdout ).toHaveBeenCalledTimes( 1 );
                expect( mockStdout ).not.toHaveBeenCalledWith( str );
                expect( mockStdout ).toHaveBeenCalledWith( expect.stringMatching( new RegExp( escapeRegexp( str ) ) ) );
            } );

            it( 'should not print any log if levels is set to false', () => {
                const debug = new Debug( { levels : false, styles : false } ); 

                const str = new Date().toString();
                debug[ method ]( str );
                expect( mockStdout ).toHaveBeenCalledTimes( 0 );
            } );

            it( 'should not print any log if levels is set to []', () => {
                const debug = new Debug( { levels : [], styles : false } ); 

                const str = new Date().toString();
                debug[ method ]( str );
                expect( mockStdout ).toHaveBeenCalledTimes( 0 );
            } );

            it( 'should not print all logs if levels is set to true', () => {
                const debug = new Debug( { levels : true, styles : false } ); 

                const str = new Date().toString();
                debug[ method ]( str );
                expect( mockStdout ).toHaveBeenCalledTimes( 1 );
                expect( mockStdout ).toHaveBeenCalledWith( str );
            } );

            it( 'should not print any log if levels is set with all levels', () => {
                const debug = new Debug( { levels : methods, styles : false } ); 

                const str = new Date().toString();
                debug[ method ]( str );
                expect( mockStdout ).toHaveBeenCalledTimes( 1 );
                expect( mockStdout ).toHaveBeenCalledWith( str );
            } );

            it( 'should format messages', () => {
                const debug = new Debug( { styles : false } ); 

                const str = new Date().toString();
                debug[ method ]( 'message: %s', str );
                expect( mockStdout ).toHaveBeenCalledTimes( 1 );
                expect( mockStdout ).toHaveBeenCalledWith( `message: ${str}` );
            } );

            it( 'should execute static method and print the original string', () => {
                const str = new Date().toString();
                Debug[ method ]( false, 'message: %s', str );
                expect( mockStdout ).toHaveBeenCalledTimes( 1 );
                expect( mockStdout ).toHaveBeenCalledWith( `message: ${str}` );
            } );

            it( 'should execute static method and print styled string', () => {
                const str = new Date().toString();
                Debug[ method ]( {}, 'message: %s', str );
                expect( mockStdout ).toHaveBeenCalledTimes( 1 );
                expect( mockStdout ).not.toHaveBeenCalledWith( `message: ${str}` );
                expect( mockStdout ).toHaveBeenCalledWith( expect.stringMatching( escapeRegexp( `message: ${str}` ) ) );
            } );
        } );
    } );

} );
