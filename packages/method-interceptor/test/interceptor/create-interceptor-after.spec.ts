/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptor/create-interceptor-after.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/11/2021
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import { createInterceptorAfter, KEY_AFTER, MetadataAfter } from '../../src';

describe( 'interceptor/create-method-after', () => {
    it( 'should created a function', () => {
        const o = { x() {} };
        const descriptor = Reflect.getOwnPropertyDescriptor( o, 'x' );
        expect( createInterceptorAfter( descriptor, {} ) ).toBeInstanceOf( Function );
    } );

    it( 'should return a Promise object by the created function', () => {
        const o = { x() {} };
        const descriptor = Reflect.getOwnPropertyDescriptor( o, 'x' );
        expect( createInterceptorAfter( descriptor, {} )() ).toBeInstanceOf( Promise );
    } );

    it( 'should return a Promise object resolves with the given value', async () => {
        const o = { x() {} };
        const descriptor = Reflect.getOwnPropertyDescriptor( o, 'x' );
        return expect( createInterceptorAfter( descriptor )( 'ynn' ) ).resolves.toEqual( 'ynn' );
    } );

    it( 'should have called the corresponding methods in order', async () => {
        const o = { x() {} };
        const descriptor = Reflect.getOwnPropertyDescriptor( o, 'x' );
        const res: string[] = [];
        const methods = {
            first : () => { res.push( 'first' ) },
            second : () => { res.push( 'second' ) }
        };
        const metadata: MetadataAfter[] = [
            { type : 'second', interceptorType : 'after' },
            { type : 'first', interceptorType : 'after' }
        ];

        Reflect.defineMetadata( KEY_AFTER, metadata, descriptor.value );
        await createInterceptorAfter( descriptor, methods )();
        expect( res ).toEqual( [ 'second', 'first' ] );
    } );

    it( 'should have called methods with default arguments', async () => {
        const o = { x() {} };
        const descriptor = Reflect.getOwnPropertyDescriptor( o, 'x' );
        const fn = jest.fn();
        const methods = { fn };
        const metadata: MetadataAfter[] = [ {
            type : 'fn',
            interceptorType : 'after'
        } ];

        Reflect.defineMetadata( KEY_AFTER, metadata, descriptor.value );
        await createInterceptorAfter( descriptor, methods )( 'ynn' );
        expect( fn ).toHaveBeenCalledWith( {
            interceptorType : 'after',
            type : 'fn'
        }, 'ynn' );
    } );

    it( 'should have called methods with given arguments', async () => {

        const o = { x() {} };
        const descriptor = Reflect.getOwnPropertyDescriptor( o, 'x' );
        const fn = jest.fn();
        const methods = { fn };
        const metadata: MetadataAfter[] = [ {
            type : 'fn',
            interceptorType : 'after'
        } ];

        Reflect.defineMetadata( KEY_AFTER, metadata, descriptor.value );
        await createInterceptorAfter( descriptor, methods )( 'ynn', 1, 2, 3 );
        expect( fn ).toHaveBeenCalledWith( {
            interceptorType : 'after',
            type : 'fn'
        }, 'ynn', 1, 2, 3 );
    } );

    it( 'should return a Promise object with expected values', async () => {
        const o = { x() {} };
        const descriptor = Reflect.getOwnPropertyDescriptor( o, 'x' )!;
        const methods = {
            fn1 : () => 'fn1',
            fn2 : () => 'fn2',
            fn3 : async () => Promise.resolve( 'fn3' )
        };
        const metadata: MetadataAfter[] = [
            { type : 'fn1', interceptorType : 'after' },
            { type : 'fn2', interceptorType : 'after' },
            { type : 'fn3', interceptorType : 'after' }
        ];

        Reflect.defineMetadata( KEY_AFTER, metadata, descriptor.value );
        const after = createInterceptorAfter( descriptor, methods );
        return expect( after() ).resolves.toEqual( 'fn3' );
    } );
} );
