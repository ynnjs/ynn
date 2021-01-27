/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-exception.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/26/2021
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import { KEY_EXCEPTION, createDecoratorException } from '../../src';

describe( 'decorator/create-decorator-exception', () => {
    it( 'should have created a method decorator', () => {
        const exception = createDecoratorException( { method : () => {} } );
        expect( exception ).toBeInstanceOf( Function );
    } );

    it( 'the decorator should emit metadata', () => {
        const exception = createDecoratorException( { method : () => {} } );
        class A { @exception fn() {} }
        const descriptor = Reflect.getOwnPropertyDescriptor( A.prototype, 'fn' )!;
        const metadata = Reflect.getMetadata( KEY_EXCEPTION, descriptor.value );
        expect( metadata ).toEqual( [ {
            type : expect.any( Symbol ),
            interceptorType : 'exception'
        } ] );
    } );

    it( 'multiple exception decorators on a method', () => {
        const exception1 = createDecoratorException( { method : () => {} } );
        const exception2 = createDecoratorException( { method : () => {} } );
        class A { @exception1 @exception2 fn() {} }
        const descriptor = Reflect.getOwnPropertyDescriptor( A.prototype, 'fn' )!;
        const metadata = Reflect.getMetadata( KEY_EXCEPTION, descriptor.value );
        expect( metadata ).toEqual( [ {
            type : expect.any( Symbol ),
            interceptorType : 'exception'
        }, {
            type : expect.any( Symbol ),
            interceptorType : 'exception'
        } ] );
    } );

    it( 'should have added parameters into metadata if it is set', () => {
        const parameters = { x : 1 };
        const exception = createDecoratorException( {
            parameters,
            method : () => {}
        } );
        class A { @exception fn() {} }
        const descriptor = Reflect.getOwnPropertyDescriptor( A.prototype, 'fn' )!;
        const metadata = Reflect.getMetadata( KEY_EXCEPTION, descriptor.value );
        expect( metadata ).toEqual( [ {
            type : expect.any( Symbol ),
            interceptorType : 'exception',
            parameters
        } ] );
    } );

    it( 'should have added exceptionType into metadata if it is set', () => {
        const parameters = { x : 1 };
        const exceptionType = Error;
        const exception = createDecoratorException( {
            exceptionType,
            parameters,
            method : () => {}
        } );
        class A { @exception fn() {} }
        const descriptor = Reflect.getOwnPropertyDescriptor( A.prototype, 'fn' )!;
        const metadata = Reflect.getMetadata( KEY_EXCEPTION, descriptor.value );
        expect( metadata ).toEqual( [ {
            type : expect.any( Symbol ),
            interceptorType : 'exception',
            exceptionType,
            parameters
        } ] );
    } );
} );
