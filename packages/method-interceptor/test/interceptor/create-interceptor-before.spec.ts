/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptor/create-interceptor-before.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/09/2021
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import { createInterceptorBefore, KEY_BEFORE, MetadataBefore } from '../../src';

describe( 'interceptor/create-method-before', () => {
    it( 'should created a function', () => {
        const o = { x() {} };
        const descriptor = Reflect.getOwnPropertyDescriptor( o, 'x' );
        expect( createInterceptorBefore<[]>( descriptor, {} ) ).toBeInstanceOf( Function );
    } );

    it( 'should return a Promise object by the created function', () => {
        const o = { x() {} };
        const descriptor = Reflect.getOwnPropertyDescriptor( o, 'x' );
        expect( createInterceptorBefore<[]>( descriptor, {} )() ).toBeInstanceOf( Promise );
    } );

    it( 'should return a Promise object which resolves with an empty array by the created function if no methods is given', async () => {
        const o = { x() {} };
        const descriptor = Reflect.getOwnPropertyDescriptor( o, 'x' );
        return expect( createInterceptorBefore<[]>( descriptor )() ).resolves.toEqual( [] );
    } );

    it( 'should have called the corresponding methods', async () => {
        const o = { x() {} };
        const descriptor = Reflect.getOwnPropertyDescriptor( o, 'x' );
        const fn = jest.fn();
        const methods = { fn };
        const metadata: MetadataBefore[] = [ {
            type : 'fn',
            interceptorType : 'before'
        } ];

        Reflect.defineMetadata( KEY_BEFORE, metadata, descriptor.value );
        const before = createInterceptorBefore<[]>( descriptor, methods );
        await before();
        expect( fn ).toHaveBeenCalledTimes( 1 );
    } );

    it( 'should have called methods with default arguments', async () => {
        const o = { x() {} };
        const descriptor = Reflect.getOwnPropertyDescriptor( o, 'x' );
        const fn = jest.fn();
        const methods = { fn };
        const metadata: MetadataBefore[] = [ {
            type : 'fn',
            interceptorType : 'before'
        } ];

        Reflect.defineMetadata( KEY_BEFORE, metadata, descriptor.value );
        const before = createInterceptorBefore<[]>( descriptor, methods );
        await before();
        expect( fn ).toHaveBeenCalledWith( {
            interceptorType : 'before',
            type : 'fn'
        } );
    } );

    it( 'should have called methods with given arguments', async () => {
        const o = { x() {} };
        const descriptor = Reflect.getOwnPropertyDescriptor( o, 'x' );
        const fn = jest.fn();
        const methods = { fn };
        const metadata: MetadataBefore[] = [ {
            type : 'fn',
            interceptorType : 'before'
        } ];

        Reflect.defineMetadata( KEY_BEFORE, metadata, descriptor.value );
        const before = createInterceptorBefore<[ number, string ]>( descriptor, methods );
        await before( 1, 'interceptor' );
        expect( fn ).toHaveBeenCalledWith( {
            interceptorType : 'before',
            type : 'fn'
        }, 1, 'interceptor' );
    } );

    it( 'should return a Promise object with expected values', async () => {
        const o = { x() {} };
        const descriptor = Reflect.getOwnPropertyDescriptor( o, 'x' );
        const methods = {
            fn1 : () => 'fn1',
            fn2 : () => 'fn2',
            fn3 : async () => Promise.resolve( 'fn3' )
        };
        const metadata: MetadataBefore[] = [
            { type : 'fn1', interceptorType : 'before' },
            { type : 'fn2', interceptorType : 'before' },
            { type : 'fn3', interceptorType : 'before' }
        ];

        if( descriptor ) {
            Reflect.defineMetadata( KEY_BEFORE, metadata, descriptor.value );
            const before = createInterceptorBefore<[]>( descriptor, methods );
            return expect( before() ).resolves.toEqual( [ 'fn1', 'fn2', 'fn3' ] );
        }
        throw new TypeError( 'Cannot get descriptor' );
    } );
} );
