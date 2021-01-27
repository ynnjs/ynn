/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-parameter.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/26/2021
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import { KEY_PARAMETER, createDecoratorParameter } from '../../src';

describe( 'decorator/create-decorator-parameter', () => {
    it( 'should have created a parameter decorator', () => {
        const parameter = createDecoratorParameter( () => {} );
        expect( parameter ).toBeInstanceOf( Function );
    } );

    it( 'the decorator should emit correct metadata', () => {
        const parameter = createDecoratorParameter( () => {} );
        class A { fn( @parameter name: string ) {} } // eslint-disable-line @typescript-eslint/no-unused-vars
        const metadata = Reflect.getMetadata( KEY_PARAMETER, A, 'fn' );
        expect( metadata ).toEqual( [
            [ {
                type : expect.any( Symbol ),
                interceptorType : 'parameter'
            } ]
        ] );
    } );

    it( 'using with multiple arguments', () => {
        const parameter1 = createDecoratorParameter( () => {} );
        const parameter2 = createDecoratorParameter( () => {} );
        class A { fn( @parameter1 name: string, @parameter2 age: number ) {} } // eslint-disable-line @typescript-eslint/no-unused-vars
        const metadata = Reflect.getMetadata( KEY_PARAMETER, A, 'fn' );
        expect( metadata ).toEqual( [
            [ {
                type : expect.any( Symbol ),
                interceptorType : 'parameter'
            } ],
            [ {
                type : expect.any( Symbol ),
                interceptorType : 'parameter'
            } ]
        ] );
    } );

    it( 'using multiple decorators', () => {
        const parameter1 = createDecoratorParameter( () => {} );
        const parameter2 = createDecoratorParameter( () => {} );
        class A { fn( @parameter1 @parameter2 name: string ) {} } // eslint-disable-line @typescript-eslint/no-unused-vars
        const metadata = Reflect.getMetadata( KEY_PARAMETER, A, 'fn' );
        expect( metadata ).toEqual( [
            [ {
                type : expect.any( Symbol ),
                interceptorType : 'parameter'
            }, {
                type : expect.any( Symbol ),
                interceptorType : 'parameter'
            } ]
        ] );
    } );

    it( 'item of array can be undefined', () => {
        const parameter2 = createDecoratorParameter( () => {} );
        class A { fn( name: string, @parameter2 age: number ) {} } // eslint-disable-line @typescript-eslint/no-unused-vars
        const metadata = Reflect.getMetadata( KEY_PARAMETER, A, 'fn' );
        expect( metadata ).toEqual( [
            undefined,
            [ {
                type : expect.any( Symbol ),
                interceptorType : 'parameter'
            } ]
        ] );
    } );
} );
