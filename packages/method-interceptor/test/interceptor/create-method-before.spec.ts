/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-method-before.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/24/2020
 * Description:
 ******************************************************************/

import { createInterceptorBefore } from '../../src/';

describe( 'interceptor/create-method-before', () => {
    it( 'should created a function', () => {
        const o = { x() {} };
        const descriptor = Reflect.getOwnPropertyDescriptor( o, 'x' );
        expect( createInterceptorBefore( descriptor, {} ) ).toBeInstanceOf( Function );
    } ); 

    it( 'should return a Promise object by the created function', () => {
        const o = { x() {} };
        const descriptor = Reflect.getOwnPropertyDescriptor( o, 'x' );
        expect( createInterceptorBefore( descriptor, {} )() ).toBeInstanceOf( Promise );
    } );

    it( 'should return a Promise object which resolves with an empty array by the created function if no methods is given', () => {
        const o = { x() {} };
        const descriptor = Reflect.getOwnPropertyDescriptor( o, 'x' );
        expect( createInterceptorBefore( descriptor )() ).resolves.toEqual( [] );
    } );
} );
