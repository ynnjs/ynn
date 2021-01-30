/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptor/create-interceptor-after.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/11/2021
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import { Storage, createInterceptorAfter, KEY_AFTER, MetadataAfter } from '../../src';
import { generateDescriptor } from '../helpers/util';

describe( 'interceptor/create-interceptor-after', () => {
    it( 'should have created a function', () => {
        expect( createInterceptorAfter( generateDescriptor() ) ).toBeInstanceOf( Function );
    } );

    it( 'should return a Promise object by the created function', () => {
        const after = createInterceptorAfter( generateDescriptor() );
        expect( after( 'x' ) ).toBeInstanceOf( Promise );
    } );

    it( 'should return a Promise object resolves with the given value', async () => {
        const after = createInterceptorAfter( generateDescriptor() );
        return expect( after( 'ynn' ) ).resolves.toEqual( 'ynn' );
    } );

    it( 'should have called the corresponding methods in order', async () => {
        const descriptor = generateDescriptor();
        const res: string[] = [];
        const first = Storage.key();
        const second = Storage.key();
        Storage.set( first, () => { res.push( 'first' ) } );
        Storage.set( second, () => { res.push( 'second' ) } );

        const metadata: MetadataAfter[] = [
            { type : second, interceptorType : 'after' },
            { type : first, interceptorType : 'after' }
        ];

        Reflect.defineMetadata( KEY_AFTER, metadata, descriptor.value );
        await createInterceptorAfter( descriptor )( 'x' );
        expect( res ).toEqual( [ 'second', 'first' ] );
    } );

    it( 'should have called methods with default arguments', async () => {
        const descriptor = generateDescriptor();
        const fn = jest.fn();
        const key = Storage.key();
        Storage.set( key, fn );
        const metadata: MetadataAfter[] = [ {
            type : key,
            interceptorType : 'after'
        } ];

        Reflect.defineMetadata( KEY_AFTER, metadata, descriptor.value );
        await createInterceptorAfter( descriptor )( 'ynn' );
        expect( fn ).toHaveBeenCalledWith( metadata[ 0 ], 'ynn' );
    } );

    it( 'should have called methods with given arguments', async () => {
        const descriptor = generateDescriptor();
        const fn = jest.fn();
        const key = Storage.key();
        Storage.set( key, fn );
        const metadata: MetadataAfter[] = [ {
            type : key,
            interceptorType : 'after'
        } ];

        Reflect.defineMetadata( KEY_AFTER, metadata, descriptor.value );
        const args = [ 1, 2, 3 ] as const;
        await createInterceptorAfter( descriptor )( 'ynn', ...args );
        expect( fn ).toHaveBeenCalledWith( metadata[ 0 ], 'ynn', ...args );
    } );

    it( 'should return a Promise object with expected values', async () => {
        const descriptor = generateDescriptor();
        const key1 = Storage.key();
        const key2 = Storage.key();
        const key3 = Storage.key();

        Storage.set( key1, () => 'fn1' );
        Storage.set( key2, () => 'fn2' );
        Storage.set( key3, async () => Promise.resolve( 'fn3' ) );

        const metadata: MetadataAfter[] = [
            { type : key1, interceptorType : 'after' },
            { type : key2, interceptorType : 'after' },
            { type : key3, interceptorType : 'after' }
        ];

        Reflect.defineMetadata( KEY_AFTER, metadata, descriptor.value );
        const after = createInterceptorAfter( descriptor );
        return expect( after( 'x' ) ).resolves.toEqual( 'fn3' );
    } );

    it( 'should have called a method using the return value of the previous method', async () => {
        const descriptor = generateDescriptor();
        const key1 = Storage.key();
        const key2 = Storage.key();
        const fn = jest.fn();

        Storage.set( key1, () => 'fn1' );
        Storage.set( key2, fn );

        const metadata: MetadataAfter[] = [
            { type : key1, interceptorType : 'after' },
            { type : key2, interceptorType : 'after' }
        ];

        Reflect.defineMetadata( KEY_AFTER, metadata, descriptor.value );
        await createInterceptorAfter( descriptor )( 'x' );
        expect( fn ).toHaveBeenCalledWith( metadata[ 1 ], 'fn1' );
    } );
} );
