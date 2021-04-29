/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptor/create-interceptor-parameter.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/25/2021
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import 'jest-extended';
import { Storage, createInterceptorParameter, KEY_PARAMETER, MetadataParameter } from '../../src';
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
        expect( createInterceptorParameter( A.prototype, 'fn' ) ).toBeInstanceOf( Function );
    } );

    it( 'should return a Promise object by the created function', () => {
        class A { fn() {} }
        const parameter = createInterceptorParameter( A.prototype, 'fn' );
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

        Reflect.defineMetadata( KEY_PARAMETER, metadata, A.prototype, 'fn' );
        await createInterceptorParameter( A.prototype, 'fn' )();
        expect( fn ).toHaveBeenCalledTimes( 1 );
    } );

    it( 'metadata can be undefined', async () => {
        class A { @Decorate fn( name: string ) {} } // eslint-disable-line
        const key = Storage.key();
        const fn = jest.fn();
        Storage.set( key, fn );

        const metadata: MetadataParameter[][] = [];

        Reflect.defineMetadata( KEY_PARAMETER, metadata, A.prototype, 'fn' );
        await createInterceptorParameter( A.prototype, 'fn' )();
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

        Reflect.defineMetadata( KEY_PARAMETER, metadata, A.prototype, 'fn' );
        await createInterceptorParameter( A.prototype, 'fn' )();
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

        const metadata: MetadataParameter[][] = [
            [ { type : key1, interceptorType : 'parameter' } ],
            [ { type : key2, interceptorType : 'parameter' } ]
        ];

        Reflect.defineMetadata( KEY_PARAMETER, metadata, A.prototype, 'fn' );
        const parameter = createInterceptorParameter( A.prototype, 'fn' );
        return expect( parameter() ).resolves.toEqual( [ 'abc', 1 ] );
    } );

    it( 'should called multiple decorators for single parameter in order', async () => {
        class A { @Decorate fn( name: string ) {} } // eslint-disable-line
        const fn1 = jest.fn();
        const fn2 = jest.fn();
        const key1 = Storage.key();
        const key2 = Storage.key();

        Storage.set( key1, fn1 );
        Storage.set( key2, fn2 );

        const metadata: MetadataParameter[][] = [ [
            { type : key2, interceptorType : 'parameter' },
            { type : key1, interceptorType : 'parameter' }
        ] ];

        Reflect.defineMetadata( KEY_PARAMETER, metadata, A.prototype, 'fn' );
        const parameter = createInterceptorParameter( A.prototype, 'fn' );
        await parameter();
        expect( fn1 ).toHaveBeenCalledBefore( fn2 );
        expect( fn1 ).toHaveBeenCalled();
        expect( fn2 ).toHaveBeenCalled();
    } );

    it( 'should pass return value through decorators of parameter', async () => {
        class A { @Decorate fn( name: string ) {} } // eslint-disable-line
        const fn1 = () => 'ynn';
        const fn2 = jest.fn();
        const key1 = Storage.key();
        const key2 = Storage.key();

        Storage.set( key1, fn1 );
        Storage.set( key2, fn2 );

        const metadata: MetadataParameter[][] = [ [
            { type : key2, interceptorType : 'parameter' },
            { type : key1, interceptorType : 'parameter' }
        ] ];

        Reflect.defineMetadata( KEY_PARAMETER, metadata, A.prototype, 'fn' );
        const parameter = createInterceptorParameter( A.prototype, 'fn' );
        await parameter( 'nny' );
        expect( fn2 ).toHaveBeenCalledWith( {
            interceptorType : 'parameter',
            paramtype : String,
            type : expect.any( Symbol )
        }, 'nny', 'ynn' );
    } );

    it( 'should have thrown an exception if the method not exists', () => {
        class A {
            @Decorate
            fn( name: string ): string {
                return name;
            }
        }

        const key = Symbol( 'some#key' );

        Reflect.defineMetadata( KEY_PARAMETER, [ [
            { type : key, interceptorType : 'parameter' }
        ] ], A.prototype, 'fn' );

        expect( () => createInterceptorParameter( A.prototype, 'fn' ) ).toThrow( `method ${key.toString()} not exists in method list` );
    } );

    it( 'shoule return Promise<null> if some parameters have not decorators', async () => {
        class A {
            @Decorate
            fn( name: string ): string {
                return name;
            }
        }

        Reflect.defineMetadata( KEY_PARAMETER, [ [] ], A.prototype, 'fn' );

        const parameter = createInterceptorParameter( A.prototype, 'fn' );
        const res = await parameter();
        expect( res ).toEqual( [ null ] );
    } );
} );