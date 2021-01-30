/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptor/extract-methods.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/23/2021
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import { Storage } from '../../src';
import extractMethods from '../../src/interceptor/extract-methods';

describe( 'interceptor/extract-methods', () => {
    it( 'should have extracted all methods have been stored in metadata', () => {
        const key = Storage.key();
        const fn = () => {};
        Storage.set( key, fn );
        class A { action() {} }
        const descriptor = Reflect.getOwnPropertyDescriptor( A.prototype, 'action' )!;
        const metadata = [ { type : key, interceptorType : 'before' } ];
        Reflect.defineMetadata( 'key', metadata, descriptor.value );
        const bound = extractMethods( 'key', descriptor );
        expect( bound ).toEqual( [ { method : fn, metadata : metadata[ 0 ] } ] );
    } );

    it( 'should have thrown an exception if the method not exsits in methods', () => {
        class A { action() {} }
        const descriptor = Reflect.getOwnPropertyDescriptor( A.prototype, 'action' )!;
        const metadata = [ { type : 'fn', interceptorType : 'before' } ];
        Reflect.defineMetadata( 'key', metadata, descriptor.value );
        expect( () => extractMethods( 'key', descriptor ) ).toThrow();
    } );
} );
