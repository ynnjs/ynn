/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: test/default.pipe.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/28/2021
 * Description:
 ******************************************************************/

import { Default } from '../src';

describe( 'Default Pipe', () => {
    it( 'should return a function', () => {
        expect( Default() ).toBeInstanceOf( Function );
    } );

    it( 'should return the value directly if the value is not empty', async () => {
        expect( await Default()( 'a' ) ).toEqual( 'a' );
    } );

    it( 'should use the given default value if the passed value is an empty string', async () => {
        expect( await Default( 'x' )( '' ) ).toEqual( 'x' );
    } );

    it( 'should use the given default value if the passed value is undefined', async () => {
        expect( await Default( 'x' )( undefined ) ).toEqual( 'x' );
    } );

    it( 'should use the given default value if the passed value is null', async () => {
        expect( await Default( 'x' )( null ) ).toEqual( 'x' );
    } );

    it( 'should support to use a callback function', async () => {
        const fn = jest.fn();
        await Default( fn )( null );
        expect( fn ).toHaveBeenCalledTimes( 1 );
    } );

    it( 'should not call the callback function if the given value is not empty', async () => {
        const fn = jest.fn();
        await Default( fn )( 'x' );
        expect( fn ).not.toHaveBeenCalled();
    } );

    it( 'should return the return value of the callback function', async () => {
        expect( await Default( () => 'x' )( null ) ).toEqual( 'x' );
    } );
} );
