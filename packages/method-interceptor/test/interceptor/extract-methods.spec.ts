/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptor/extract-methods.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/23/2021
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import extractMethods from '../../src/interceptor/extract-methods';

describe( 'interceptor/extract-methods', () => {
    it( 'should have extracted all methods have been stored in metadata', () => {
        class A { action() {} }
        const methods = { fn() {} };
        const descriptor = Reflect.getOwnPropertyDescriptor( A.prototype, 'action' )!;
        const metadata = [ { type : 'fn', interceptorType : 'before' } ];
        Reflect.defineMetadata( 'key', metadata, descriptor.value );
        const bound = extractMethods( 'key', descriptor, methods );
        expect( bound ).toEqual( [ { method : methods.fn, metadata : metadata[ 0 ] } ] );
    } );

    it( 'should have thrown an exception if the method not exsits in methods', () => {
        class A { action() {} }
        const methods = {};
        const descriptor = Reflect.getOwnPropertyDescriptor( A.prototype, 'action' )!;
        const metadata = [ { type : 'fn', interceptorType : 'before' } ];
        Reflect.defineMetadata( 'key', metadata, descriptor.value );
        expect( () => extractMethods( 'key', descriptor, methods ) ).toThrow();
    } );

    it( 'should have support using Symbol as the key for metadata', () => {
        const KEY = Symbol( 'key' );
        class A { action() {} }
        const methods = { fn() {} };
        const descriptor = Reflect.getOwnPropertyDescriptor( A.prototype, 'action' )!;
        const metadata = [ { type : 'fn', interceptorType : 'before' } ];
        Reflect.defineMetadata( KEY, metadata, descriptor.value );
        const bound = extractMethods( KEY, descriptor, methods );
        expect( bound ).toEqual( [ { method : methods.fn, metadata : metadata[ 0 ] } ] );
    } );
} );
