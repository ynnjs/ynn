/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: test/toThrowHttpException.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/25/2021
 * Description:
 ******************************************************************/

import { HttpException } from '@ynn/http-exception';
import matchers from '../src/matchers';

expect.extend( matchers );

describe( '.toThrowHttpException', () => {
    it( 'passes when thrown an arbitrary HttpException', () => {
        expect( () => { throw new HttpException( 400 ) } ).toThrowHttpException();
        expect( () => { throw new HttpException( 400, 'Something Error' ) } ).toThrowHttpException();
        expect( () => { throw new HttpException( { status : 400, message : [ 'Something Error' ] } ) } ).toThrowHttpException();
    } );

    it( 'passes when thrown an HttpException matched the expect HttpException instance', () => {
        expect( () => { throw new HttpException( 400 ) } ).toThrowHttpException( new HttpException( 400 ) );
        expect( () => { throw new HttpException( 400, 'Something Error' ) } ).toThrowHttpException( new HttpException( 400, 'Something Error' ) );
        const response = { status : 400, message : [ 'Something Error' ] };
        expect( () => { throw new HttpException( response ) } ).toThrowHttpException( new HttpException( response ) );
    } );

    it( 'passes when thrown an HttpException and matched the given status', () => {
        expect( () => { throw new HttpException( 400 ) } ).toThrowHttpException( 400 );
        expect( () => { throw new HttpException( 400, 'Something Error' ) } ).toThrowHttpException( 400 );
        expect( () => { throw new HttpException( 400, 'Something Error' ) } ).toThrowHttpException( 400 );
        expect( () => { throw new HttpException( { status : 400, message : [ 'Something Error' ] } ) } ).toThrowHttpException( 400 );
    } );

    it( 'passes when thrown an HttpException and matched the given error message', () => {
        expect( () => { throw new HttpException( 400 ) } ).toThrowHttpException( 'Bad Request' );
        expect( () => { throw new HttpException( 400, 'Something Error' ) } ).toThrowHttpException( 'Something Error' );
        expect( () => { throw new HttpException( { status : 400, error : 'Something Error' } ) } ).toThrowHttpException( 'Something Error' );
    } );

    it( 'passes when thrown an HttpException and matched both the given status and error message', () => {
        expect( () => { throw new HttpException( 400 ) } ).toThrowHttpException( 400, 'Bad Request' );
        expect( () => { throw new HttpException( 400, 'Something Error' ) } ).toThrowHttpException( 400, 'Something Error' );
        expect( () => { throw new HttpException( { status : 400, error : 'Something Error' } ) } ).toThrowHttpException( 400, 'Something Error' );
    } );

    it( 'fails when not thrown any exception', () => {
        expect( () => {
            expect( () => {} ).toThrowHttpException();
        } ).toThrowErrorMatchingSnapshot();
    } );

    it( 'fails when not thrown HttpException', () => {
        expect( () => {
            expect( () => { throw new Error() } ).toThrowHttpException();
        } ).toThrowErrorMatchingSnapshot();
    } );

    it( 'fails when thrown an HttpException but not matched the given HttpException instance', () => {
        expect( () => {
            expect( () => { throw new HttpException( 401 ) } ).toThrowHttpException( new HttpException( 400 ) );
        } ).toThrowErrorMatchingSnapshot();
        expect( () => {
            expect( () => { throw new HttpException( 400, 'Something Error' ) } ).toThrowHttpException( new HttpException( 400 ) );
        } ).toThrowErrorMatchingSnapshot();
    } );

    it( 'fails when thrown an HttpException and not matched the given status', () => {
        expect( () => {
            expect( () => { throw new HttpException( 401 ) } ).toThrowHttpException( 400 );
        } ).toThrowErrorMatchingSnapshot();

        expect( () => {
            expect( () => { throw new HttpException( 401, 'something error' ) } ).toThrowHttpException( 400 );
        } ).toThrowErrorMatchingSnapshot();

        expect( () => {
            expect( () => { throw new HttpException( { status : 401, error : 'something error' } ) } ).toThrowHttpException( 400 );
        } ).toThrowErrorMatchingSnapshot();
    } );

    it( 'fails when thrown an HttpException and not matched the given error message', () => {
        expect( () => {
            expect( () => { throw new HttpException( 400 ) } ).toThrowHttpException( 'Something Error' );
        } ).toThrowErrorMatchingSnapshot();

        expect( () => {
            expect( () => { throw new HttpException( 400, 'something error' ) } ).toThrowHttpException( 400, 'Bad Request' );
        } ).toThrowErrorMatchingSnapshot();

        expect( () => {
            expect( () => { throw new HttpException( { status : 401, error : 'something error' } ) } ).toThrowHttpException( 400, 'Bad Request' );
        } ).toThrowErrorMatchingSnapshot();
    } );
} );

describe( '.not.toThrowHttpException', () => {
    it( 'passes when not thrown any exception', () => {
        expect( () => {} ).not.toThrowHttpException();
    } );

    it( 'passes when not thrown a HttpException', () => {
        expect( () => { throw new Error() } ).not.toThrowHttpException();
    } );

    it( 'passes when thrown a HttpException but not matched the given status', () => {
        expect( () => { throw new HttpException( 400 ) } ).not.toThrowHttpException( 401 );
    } );

    it( 'passes when thrown a HttpException but not matched the given error message', () => {
        expect( () => { throw new HttpException( 400 ) } ).not.toThrowHttpException( 'Something Error' );
    } );

    it( 'passes when thrown a HttpException but not matched the given response', () => {
        expect( () => { throw new HttpException( { status : 400, message : [ 'Bad Request' ] } ) } ).not.toThrowHttpException( new HttpException( {
            status : 400,
            message : [ 'Something Error' ]
        } ) );
    } );
} );
