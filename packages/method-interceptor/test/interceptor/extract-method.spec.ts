/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/extract-method.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/24/2020
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import extractMethod from '../../src/interceptor/extract-method';

describe( 'interceptor/extract-method', () => {
   
    it( '', () => {

        class A {
            action() {}
        }

        const methods = {
            fn() {
            }
        };

        const descriptor = Reflect.getOwnPropertyDescriptor( A.prototype, 'action' );

        const metadata = [ {
            type : 'fn',
            interceptorType : 'before'
        } ];

        if( descriptor ) {
            Reflect.defineMetadata( 'key', metadata, descriptor.value );
            const bound = extractMethod( 'key', methods, descriptor );
            expect( bound ).toEqual( [ {
                method : methods.fn,
                metadata : metadata[ 0 ]
            } ] );
        }
    } );

} );
