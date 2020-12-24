/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/extract-method.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/24/2020
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import extract from '../../src/interceptor/extract';

describe( 'interceptor/extract-method', () => {

    describe( 'extract.methods', () => {
        
        it( 'should return the correct list of bound methods', () => {

            class A {
                action() {}
            }

            const methods = {
                fn() {}
            };

            const descriptor = Reflect.getOwnPropertyDescriptor( A.prototype, 'action' );

            const metadata = [ {
                type : 'fn',
                interceptorType : 'before'
            } ];

            if( descriptor ) {
                Reflect.defineMetadata( 'key', metadata, descriptor.value );
                const bound = extract.methods( 'key', methods, descriptor );
                expect( bound ).toEqual( [ {
                    method : methods.fn,
                    metadata : metadata[ 0 ]
                } ] );
            }
        } );

        it( 'should use undefined if some type of interceptor does not have corresponding method', () => {
            
            class A {
                action() {}
            }

            const methods = {};

            const descriptor = Reflect.getOwnPropertyDescriptor( A.prototype, 'action' );

            const metadata = [ {
                type : 'fn',
                interceptorType : 'before'
            } ];

            if( descriptor ) {
                Reflect.defineMetadata( 'key', metadata, descriptor.value );
                const bound = extract.methods( 'key', methods, descriptor );
                expect( bound ).toEqual( [ {
                    method : undefined,
                    metadata : metadata[ 0 ]
                } ] );
            }
        } );

    } );
} );
