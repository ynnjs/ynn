/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptor/create-interceptor-finally.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/05/2021
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import { Storage, createInterceptorFinally, KEY_FINALLY, MetadataFinally } from '../../src';
import { generateDescriptor } from '../helpers/util';

describe( 'interceptor/create-interceptor-finally', () => {
    it( 'should created a function', () => {
        expect( createInterceptorFinally( generateDescriptor() ) ).toBeInstanceOf( Function );
    } );

    it( 'should return a Promise object by the created function', () => {
        expect( createInterceptorFinally( generateDescriptor() )() ).toBeInstanceOf( Promise );
    } );

    it( 'should return a Promise object which resolves with an empty array by the created function if no methods is stored', async () => {
        return expect( createInterceptorFinally( generateDescriptor() )() ).resolves.toEqual( [] );
    } );

    it( 'should have called the corresponding methods in storage', async () => {
        const descriptor = generateDescriptor();
        const fn = jest.fn();
        const key = Storage.key();
        Storage.set( key, fn );
        const metadata: MetadataFinally[] = [ {
            type : key,
            interceptorType : 'finally'
        } ];

        Reflect.defineMetadata( KEY_FINALLY, metadata, descriptor.value );
        await createInterceptorFinally( descriptor )();
        expect( fn ).toHaveBeenCalledTimes( 1 );
    } );

    it( 'should have called methods with default arguments', async () => {
        const descriptor = generateDescriptor();
        const fn = jest.fn();
        const key = Storage.key();
        Storage.set( key, fn );
        const metadata: MetadataFinally[] = [ {
            type : key,
            interceptorType : 'finally'
        } ];

        Reflect.defineMetadata( KEY_FINALLY, metadata, descriptor.value );
        await createInterceptorFinally( descriptor )();
        expect( fn ).toHaveBeenCalledWith( {
            interceptorType : 'finally',
            type : key
        } );
    } );

    it( 'should have called methods with given arguments', async () => {
        const descriptor = generateDescriptor();
        const fn = jest.fn();
        const key = Storage.key();
        Storage.set( key, fn );
        const metadata: MetadataFinally[] = [ {
            type : key,
            interceptorType : 'finally'
        } ];

        Reflect.defineMetadata( KEY_FINALLY, metadata, descriptor.value );
        await createInterceptorFinally<[ number, string ]>( descriptor )( 1, 'interceptor' );
        expect( fn ).toHaveBeenCalledWith( metadata[ 0 ], 1, 'interceptor' );
    } );

    it( 'should return a Promise object with expected values', async () => {
        const descriptor = generateDescriptor();
        const key1 = Storage.key();
        const key2 = Storage.key();
        const key3 = Storage.key();

        Storage.set( key1, () => 'fn1' );
        Storage.set( key2, () => 'fn2' );
        Storage.set( key3, async () => Promise.resolve( 'fn3' ) );

        const metadata: MetadataFinally[] = [
            { type : key1, interceptorType : 'finally' },
            { type : key2, interceptorType : 'finally' },
            { type : key3, interceptorType : 'finally' }
        ];

        Reflect.defineMetadata( KEY_FINALLY, metadata, descriptor.value );
        const f = createInterceptorFinally( descriptor );
        return expect( f() ).resolves.toEqual( [ 'fn1', 'fn2', 'fn3' ] );
    } );

    it( 'should support creating interceptor functions for class constructor', async () => {

        class A {};

        const [ key1, key2, key3 ] = [ Storage.key(), Storage.key(), Storage.key() ];

        Storage.set( key1, () => 'fn1' );
        Storage.set( key2, () => 'fn2' );
        Storage.set( key3, async () => Promise.resolve( 'fn3' ) );

        const metadata: MetadataFinally[] = [
            { type : key1, interceptorType : 'finally' },
            { type : key2, interceptorType : 'finally' },
            { type : key3, interceptorType : 'finally' }
        ];

        Reflect.defineMetadata( KEY_FINALLY, metadata, A );
        const f = createInterceptorFinally( A );
        return expect( f() ).resolves.toEqual( [ 'fn1', 'fn2', 'fn3' ] );
    } );
} );
