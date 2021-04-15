/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: test/index.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/14/2021
 * Description:
 ******************************************************************/

import { HttpException } from '../src';

describe( '@ynn/http-exception', () => {
    it( 'should be extended from Error', () => {
        expect( new HttpException( 500 ) ).toBeInstanceOf( Error );
    } ); 

    it( 'should have a propery named message', () => {
        expect( new HttpException( 500 ) ).toHaveProperty( 'message' );
    } );

    it( 'should have a prperty named status', () => {
        expect( new HttpException( 500 ) ).toHaveProperty( 'status' );
    } );

    it( 'should have a property named response', () => {
        expect( new HttpException( 500 ) ).toHaveProperty( 'response' );
    } );
} );
