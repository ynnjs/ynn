/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-after.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/26/2021
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import { KEY_AFTER, createDecoratorAfter } from '../../src';

describe( 'decorator/create-decorator-after', () => {
    it( 'should have created a method decorator', () => {
        const after = createDecoratorAfter( { method : () => {} } );
        expect( after ).toBeInstanceOf( Function );
    } );

    it( 'the decorator should emit correct metadata', () => {
        const after = createDecoratorAfter( { method : () => {} } );
        class A { @after fn() {} }
        const descriptor = Reflect.getOwnPropertyDescriptor( A.prototype, 'fn' )!;
        const metadata = Reflect.getMetadata( KEY_AFTER, descriptor.value );
        expect( metadata ).toEqual( [ {
            type : expect.any( Symbol ),
            interceptorType : 'after'
        } ] );
    } );

    it( 'using mutiple decorators', () => {
        const after1 = createDecoratorAfter( { method : () => {} } );
        const after2 = createDecoratorAfter( { method : () => {} } );
        class A { @after1 @after2 fn() {} }
        const descriptor = Reflect.getOwnPropertyDescriptor( A.prototype, 'fn' )!;
        const metadata = Reflect.getMetadata( KEY_AFTER, descriptor.value );
        expect( metadata ).toEqual( [ {
            type : expect.any( Symbol ),
            interceptorType : 'after'
        }, {
            type : expect.any( Symbol ),
            interceptorType : 'after'
        } ] );
    } );

    it( 'should have added parameters into metadata if it is set', () => {
        const parameters = { x : 1 };
        const after = createDecoratorAfter( {
            parameters,
            method : () => {}
        } );
        class A { @after fn() {} }
        const descriptor = Reflect.getOwnPropertyDescriptor( A.prototype, 'fn' )!;
        const metadata = Reflect.getMetadata( KEY_AFTER, descriptor.value );
        expect( metadata ).toEqual( [ {
            type : expect.any( Symbol ),
            interceptorType : 'after',
            parameters
        } ] );
    } );
} );
