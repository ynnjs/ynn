/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/extract-method.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/24/2020
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import { KEY_BEFORE, KEY_AFTER, KEY_EXCEPTION, KEY_PARAMETER } from '../../src/constants';
import extract from '../../src/interceptor/extract';

describe( 'interceptor/extract', () => {

    [ 
        { t : 'before', k : KEY_BEFORE },
        { t : 'after', k : KEY_AFTER },
        { t : 'exception', k : KEY_EXCEPTION }
    ].forEach( ( x ) => {
        describe( `extract.${x.t}`, () => {
            
            it( 'should return the correct list of bound methods', () => {

                class A { action() {} }

                const methods = { fn() {} };

                const descriptor = Reflect.getOwnPropertyDescriptor( A.prototype, 'action' );

                const metadata = [ {
                    type : 'fn',
                    interceptorType : x.t 
                } ];

                if( descriptor ) {
                    Reflect.defineMetadata( x.k, metadata, descriptor.value );
                    const bound = extract[ x.t ]( descriptor, methods );
                    expect( bound ).toEqual( [ {
                        method : methods.fn,
                        metadata : metadata[ 0 ]
                    } ] );
                }
            } );

            it( 'should use undefined if some type of interceptor does not have corresponding method', () => {
                
                class A { action() {} }

                const methods = {};

                const descriptor = Reflect.getOwnPropertyDescriptor( A.prototype, 'action' );

                const metadata = [ {
                    type : 'fn',
                    interceptorType : x.t 
                } ];

                if( descriptor ) {
                    Reflect.defineMetadata( x.k, metadata, descriptor.value );
                    const bound = extract[ x.t ]( descriptor, methods );
                    expect( bound ).toEqual( [ {
                        method : undefined,
                        metadata : metadata[ 0 ]
                    } ] );
                }
            } );

            it( 'should have returned an empty array if metadata not exists', () => {
                class A { action() {} }

                const methods = {};
                const descriptor = Reflect.getOwnPropertyDescriptor( A.prototype, 'action' );

                expect( extract[ x.t ]( descriptor, methods ) ).toEqual( [] ); 
            } );

        } );
    } );

    describe( 'extract.parameter', () => {
        
    } );
} );
