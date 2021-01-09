/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptor/create-interceptor-before.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/09/2021
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

    it( 'should return a Promise object with expected values', () => {

    } );

    it( 'should have called the corresponding methods', () => {
        const o = { x() {} };
        const descriptor = Reflect.getOwnPropertyDescriptor( o, 'x' );
        const fn = jest.fn();
        const methods = { fn };
        createInterceptorBefore( descriptor, methods )();
        expect( fn ).toHaveBeenCalledTimes( 1 );
    } );
} );
