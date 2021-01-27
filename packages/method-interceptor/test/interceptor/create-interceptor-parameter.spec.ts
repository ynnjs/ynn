/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptor/create-interceptor-parameter.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/25/2021
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import Storage from '../../src/storage';
import { createInterceptorParameter, KEY_PARAMETER, MetadataParameter } from '../../src';
import Decorate from '../helpers/decorate';

describe( 'interceptor/create-interceptor-parameter', () => {
    it( 'should have created a function', () => {
        class A {
            @Decorate
            fn() {}
        }
        expect( createInterceptorParameter( A, 'fn' ) ).toBeInstanceOf( Function );
    } );

    it( 'should have created a function even if the decorator metadata has not been emitted', () => {
        class A { fn() {} }
        expect( createInterceptorParameter( A, 'fn' ) ).toBeInstanceOf( Function );
    } );

    it( 'should return a Promise object by the created function', () => {
        class A { fn() {} }
        const parameter = createInterceptorParameter( A, 'fn' );
        expect( parameter() ).toBeInstanceOf( Promise );
    } );

    it( 'should have called the corresponding methods', async () => {
        class A { @Decorate fn( name: string ) {} } // eslint-disable-line
        const key = Storage.key();
        const fn = jest.fn();
        Storage.set( key, fn );

        const metadata: MetadataParameter[][] = [
            [ {
                type : key,
                interceptorType : 'parameter'
            } ]
        ];

        Reflect.defineMetadata( KEY_PARAMETER, metadata, A, 'fn' );
        await createInterceptorParameter( A, 'fn' )();
        expect( fn ).toHaveBeenCalledTimes( 1 );
    } );

    it( 'metadata can be undefined', async () => {
        class A { @Decorate fn( name: string ) {} } // eslint-disable-line
        const key = Storage.key();
        const fn = jest.fn();
        Storage.set( key, fn );

        const metadata: MetadataParameter[][] = [];

        Reflect.defineMetadata( KEY_PARAMETER, metadata, A, 'fn' );
        await createInterceptorParameter( A, 'fn' )();
    } );

    it( 'should have called the corresponding methods with correct arguments', async () => {
        class A { @Decorate fn( name: string ) {} } // eslint-disable-line
        const key = Storage.key();
        const fn = jest.fn();
        Storage.set( key, fn );

        const metadata: MetadataParameter[][] = [
            [ {
                type : key,
                interceptorType : 'parameter'
            } ]
        ];

        Reflect.defineMetadata( KEY_PARAMETER, metadata, A, 'fn' );
        await createInterceptorParameter( A, 'fn' )();
        expect( fn ).toHaveBeenCalledWith( {
            ...metadata[ 0 ][ 0 ],
            paramtype : String
        } );
    } );

    it( 'should return a Promise resolves with return values of corresponding methods', async () => {
        class A { @Decorate fn( name: string, age: number ) {} } // eslint-disable-line
        const key1 = Storage.key();
        const key2 = Storage.key();

        Storage.set( key1, () => 'abc' );
        Storage.set( key2, () => 1 );

        const metadata: MetadataParameter[] = [
            [
                { type : key1, interceptorType : 'parameter' },
                { type : key2, interceptorType : 'parameter' }
            ]
        ];

        Reflect.defineMetadata( KEY_PARAMETER, metadata, A, 'fn' );
        const parameter = createInterceptorParameter( A, 'fn' );
        expect( parameter() ).resolves.toEqual( [ 'abc', 1 ] );
    } );
} );
