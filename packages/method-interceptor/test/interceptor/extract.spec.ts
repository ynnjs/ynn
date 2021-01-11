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

            it( 'should throw exception if some types of interceptors have no corresponding method', () => {

                class A { action() {} }

                const methods = {};

                const descriptor = Reflect.getOwnPropertyDescriptor( A.prototype, 'action' );

                const metadata = [ {
                    type : 'fn',
                    interceptorType : x.t
                } ];

                if( descriptor ) {
                    Reflect.defineMetadata( x.k, metadata, descriptor.value );
                    expect( () => { extract[ x.t ]( descriptor, methods ) } ).toThrow();
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

        it( 'should only have parameter metadata', () => {

            class A { action() {} }

            const methods = { fn() {} };

            Reflect.defineMetadata( 'design:paramtypes', [ String ], A.prototype, 'action' );

            expect( extract.parameter( A, 'action', methods ) ).toEqual( [ {
                method : undefined,
                metadata : {
                    paramtype : String
                }
            } ] );

        } );

        it( 'should have both parameter metadata and interceptor metadata', () => {

            class A { action() {} }

            const methods = { fn() {} };

            const metadata = [ {
                type : 'fn',
                interceptorType : 'parameter'
            } ];

            Reflect.defineMetadata( 'design:paramtypes', [ String ], A.prototype, 'action' );
            Reflect.defineMetadata( KEY_PARAMETER, metadata, A.prototype, 'action' );

            expect( extract.parameter( A, 'action', methods ) ).toEqual( [ {
                method : methods.fn,
                metadata : {
                    ...metadata[ 0 ],
                    paramtype : String
                }
            } ] );
        } );

    } );

} );
