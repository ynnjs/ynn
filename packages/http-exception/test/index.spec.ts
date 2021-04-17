/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: test/index.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/14/2021
 * Description:
 ******************************************************************/

import statuses from 'statuses';
import { HttpException } from '../src';

describe( '@ynn/http-exception', () => {
    it( 'should be extended from Error', () => {
        expect( new HttpException( 500 ) ).toBeInstanceOf( Error );
    } );

    it( 'should have a propery named error', () => {
        expect( new HttpException( 500 ) ).toHaveProperty( 'error' );
    } );

    it( 'should have a prperty named status', () => {
        expect( new HttpException( 500 ) ).toHaveProperty( 'status' );
    } );

    it( 'should have a property named response', () => {
        expect( new HttpException( 500 ) ).toHaveProperty( 'response' );
    } );

    it( 'set status directly', () => {
        expect( new HttpException( 400 ).status ).toEqual( 400 );
    } );

    it( 'set status in response object', () => {
        expect( new HttpException( { status : 400 } ).status ).toEqual( 400 );
    } );

    it( 'set error description directly', () => {
        expect( new HttpException( 400, 'something error' ).error ).toEqual( 'something error' );
    } );

    it( 'set error description in response object', () => {
        expect( new HttpException( { status : 400, error : 'something error' } ).error ).toEqual( 'something error' );
    } );

    it( 'set response with a number', () => {
        expect( new HttpException( 400 ).response ).toEqual( 400 );
    } );

    it( 'set response with a string', () => {
        expect( new HttpException( 'something error' ).response ).toEqual( 'something error' );
    } );

    it( 'set response with an object', () => {

        const response = {
            status : 0,
            message : [],
            error : 'something error'
        };

        expect( new HttpException( response ).response ).toEqual( response );
    } );

    it( 'should use the HTTP error message as default error message', () => {
        expect( new HttpException( 304 ).error ).toEqual( statuses.message[ 304 ] );
        expect( new HttpException( { status : 304 } ).error ).toEqual( statuses.message[ 304 ] );
    } );
} );
