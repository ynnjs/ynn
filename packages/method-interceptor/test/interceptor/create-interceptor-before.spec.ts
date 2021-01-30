/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptor/create-interceptor-before.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/09/2021
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import { Storage, createInterceptorBefore, KEY_BEFORE, MetadataBefore } from '../../src';
import { generateDescriptor } from '../helpers/util';

describe( 'interceptor/create-interceptor-before', () => {
    it( 'should created a function', () => {
        expect( createInterceptorBefore( generateDescriptor() ) ).toBeInstanceOf( Function );
    } );

    it( 'should return a Promise object by the created function', () => {
        expect( createInterceptorBefore( generateDescriptor() )() ).toBeInstanceOf( Promise );
    } );

    it( 'should return a Promise object which resolves with an empty array by the created function if no methods is stored', async () => {
        return expect( createInterceptorBefore( generateDescriptor() )() ).resolves.toEqual( [] );
    } );

    it( 'should have called the corresponding methods in storage', async () => {
        const descriptor = generateDescriptor();
        const fn = jest.fn();
        const key = Storage.key();
        Storage.set( key, fn );
        const metadata: MetadataBefore[] = [ {
            type : key,
            interceptorType : 'before'
        } ];

        Reflect.defineMetadata( KEY_BEFORE, metadata, descriptor.value );
        await createInterceptorBefore( descriptor )();
        expect( fn ).toHaveBeenCalledTimes( 1 );
    } );

    it( 'should have called methods with default arguments', async () => {
        const descriptor = generateDescriptor();
        const fn = jest.fn();
        const key = Storage.key();
        Storage.set( key, fn );
        const metadata: MetadataBefore[] = [ {
            type : key,
            interceptorType : 'before'
        } ];

        Reflect.defineMetadata( KEY_BEFORE, metadata, descriptor.value );
        await createInterceptorBefore( descriptor )();
        expect( fn ).toHaveBeenCalledWith( {
            interceptorType : 'before',
            type : key
        } );
    } );

    it( 'should have called methods with given arguments', async () => {
        const descriptor = generateDescriptor();
        const fn = jest.fn();
        const key = Storage.key();
        Storage.set( key, fn );
        const metadata: MetadataBefore[] = [ {
            type : key,
            interceptorType : 'before'
        } ];

        Reflect.defineMetadata( KEY_BEFORE, metadata, descriptor.value );
        await createInterceptorBefore<[ number, string ]>( descriptor )( 1, 'interceptor' );
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

        const metadata: MetadataBefore[] = [
            { type : key1, interceptorType : 'before' },
            { type : key2, interceptorType : 'before' },
            { type : key3, interceptorType : 'before' }
        ];

        Reflect.defineMetadata( KEY_BEFORE, metadata, descriptor.value );
        const before = createInterceptorBefore( descriptor );
        return expect( before() ).resolves.toEqual( [ 'fn1', 'fn2', 'fn3' ] );
    } );
} );
