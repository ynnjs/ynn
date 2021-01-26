/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-before.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/26/2021
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import { KEY_BEFORE, createDecoratorBefore } from '../../src';

describe( 'decorator/create-decorator-before', () => {
    it( 'should have created a method decorator', () => {
        const before = createDecoratorBefore( { method : () => {} } );
        expect( before ).toBeInstanceOf( Function );
    } );

    it( 'the decorator should emit metadata', () => {
        const before = createDecoratorBefore( { method : () => {} } );
        class A { @before fn() {} }
        const descriptor = Reflect.getOwnPropertyDescriptor( A.prototype, 'fn' )!;
        const metadata = Reflect.getMetadata( KEY_BEFORE, descriptor.value );
        expect( metadata ).toEqual( [ {
            type : expect.any( Symbol ),
            interceptorType : 'before'
        } ] );
    } );

    it( 'multiple before decorators on a method', () => {
        const before1 = createDecoratorBefore( { method : () => {} } );
        const before2 = createDecoratorBefore( { method : () => {} } );
        class A { @before1 @before2 fn() {} }
        const descriptor = Reflect.getOwnPropertyDescriptor( A.prototype, 'fn' )!;
        const metadata = Reflect.getMetadata( KEY_BEFORE, descriptor.value );
        expect( metadata ).toEqual( [ {
            type : expect.any( Symbol ),
            interceptorType : 'before'
        }, {
            type : expect.any( Symbol ),
            interceptorType : 'before'
        } ] );
    } );

    it( 'should have added parameters into metadata if it is set', () => {
        const parameters = { x : 1 };
        const before = createDecoratorBefore( {
            parameters,
            method : () => {}
        } );
        class A { @before fn() {} }
        const descriptor = Reflect.getOwnPropertyDescriptor( A.prototype, 'fn' )!;
        const metadata = Reflect.getMetadata( KEY_BEFORE, descriptor.value );
        expect( metadata ).toEqual( [ {
            type : expect.any( Symbol ),
            interceptorType : 'before',
            parameters
        } ] );
    } );
} );
