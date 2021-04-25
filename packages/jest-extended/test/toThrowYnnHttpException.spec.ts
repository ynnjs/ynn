/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: test/toThrowYnnHttpException.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/25/2021
 * Description:
 ******************************************************************/

import { HttpException } from '@ynn/http-exception';
import matchers from '../src/matchers';

expect.extend( matchers );

describe( '.toThrowYnnHttpException', () => {
    it( 'passes when thrown an arbitrary HttpException', () => {
        expect( () => { throw new HttpException( 400 ) } ).toThrowYnnHttpException();
        expect( () => { throw new HttpException( 400, 'Something Error' ) } ).toThrowYnnHttpException();
        expect( () => { throw new HttpException( { status : 400, message : [ 'Something Error' ] } ) } ).toThrowYnnHttpException();
    } );

    it( 'passes when thrown an HttpException matched the expect HttpException instance', () => {
        expect( () => { throw new HttpException( 400 ) } ).toThrowYnnHttpException( new HttpException( 400 ) );
        expect( () => { throw new HttpException( 400, 'Something Error' ) } ).toThrowYnnHttpException( new HttpException( 400, 'Something Error' ) );
        const response = { status : 400, message : [ 'Something Error' ] };
        expect( () => { throw new HttpException( response ) } ).toThrowYnnHttpException( new HttpException( response ) );
    } );

    it( 'passes when thrown an HttpException and matched the given status', () => {
        expect( () => { throw new HttpException( 400 ) } ).toThrowYnnHttpException( 400 );
        expect( () => { throw new HttpException( 400, 'Something Error' ) } ).toThrowYnnHttpException( 400 );
        expect( () => { throw new HttpException( 400, 'Something Error' ) } ).toThrowYnnHttpException( 400 );
        expect( () => { throw new HttpException( { status : 400, message : [ 'Something Error' ] } ) } ).toThrowYnnHttpException( 400 );
    } );

    it( 'passes when thrown an HttpException and matched the given error message', () => {
        expect( () => { throw new HttpException( 400 ) } ).toThrowYnnHttpException( 'Bad Request' );
        expect( () => { throw new HttpException( 400, 'Something Error' ) } ).toThrowYnnHttpException( 'Something Error' );
        expect( () => { throw new HttpException( { status : 400, error : 'Something Error' } ) } ).toThrowYnnHttpException( 'Something Error' );
    } );

    it( 'passes when thrown an HttpException and matched both the given status and error message', () => {
        expect( () => { throw new HttpException( 400 ) } ).toThrowYnnHttpException( 400, 'Bad Request' );
        expect( () => { throw new HttpException( 400, 'Something Error' ) } ).toThrowYnnHttpException( 400, 'Something Error' );
        expect( () => { throw new HttpException( { status : 400, error : 'Something Error' } ) } ).toThrowYnnHttpException( 400, 'Something Error' );
    } );

    it( 'fails when not thrown any exception', () => {
        expect( () => {
            expect( () => {} ).toThrowYnnHttpException();
        } ).toThrowErrorMatchingSnapshot();
    } );

    it( 'fails when not thrown HttpException', () => {
        expect( () => {
            expect( () => { throw new Error() } ).toThrowYnnHttpException();
        } ).toThrowErrorMatchingSnapshot();
    } );

    it( 'fails when thrown an HttpException but not matched the given HttpException instance', () => {
        expect( () => {
            expect( () => { throw new HttpException( 401 ) } ).toThrowYnnHttpException( new HttpException( 400 ) );
        } ).toThrowErrorMatchingSnapshot();
        expect( () => {
            expect( () => { throw new HttpException( 400, 'Something Error' ) } ).toThrowYnnHttpException( new HttpException( 400 ) );
        } ).toThrowErrorMatchingSnapshot();
    } );

    it( 'fails when thrown an HttpException and not matched the given status', () => {
        expect( () => {
            expect( () => { throw new HttpException( 401 ) } ).toThrowYnnHttpException( 400 );
        } ).toThrowErrorMatchingSnapshot();

        expect( () => {
            expect( () => { throw new HttpException( 401, 'something error' ) } ).toThrowYnnHttpException( 400 );
        } ).toThrowErrorMatchingSnapshot();

        expect( () => {
            expect( () => { throw new HttpException( { status : 401, error : 'something error' } ) } ).toThrowYnnHttpException( 400 );
        } ).toThrowErrorMatchingSnapshot();
    } );

    it( 'fails when thrown an HttpException and not matched the given error message', () => {
        expect( () => {
            expect( () => { throw new HttpException( 400 ) } ).toThrowYnnHttpException( 'Something Error' );
        } ).toThrowErrorMatchingSnapshot();

        expect( () => {
            expect( () => { throw new HttpException( 400, 'something error' ) } ).toThrowYnnHttpException( 400, 'Bad Request' );
        } ).toThrowErrorMatchingSnapshot();

        expect( () => {
            expect( () => { throw new HttpException( { status : 401, error : 'something error' } ) } ).toThrowYnnHttpException( 400, 'Bad Request' );
        } ).toThrowErrorMatchingSnapshot();
    } );
} );

describe( '.not.toThrowYnnHttpException', () => {
    it( 'passes when not thrown any exception', () => {
        expect( () => {} ).not.toThrowYnnHttpException();
    } );

    it( 'passes when not thrown a HttpException', () => {
        expect( () => { throw new Error() } ).not.toThrowYnnHttpException();
    } );

    it( 'passes when thrown a HttpException but not matched the given status', () => {
        expect( () => { throw new HttpException( 400 ) } ).not.toThrowYnnHttpException( 401 );
    } );

    it( 'passes when thrown a HttpException but not matched the given error message', () => {
        expect( () => { throw new HttpException( 400 ) } ).not.toThrowYnnHttpException( 'Something Error' );
    } );

    it( 'passes when thrown a HttpException but not matched the given response', () => {
        expect( () => { throw new HttpException( { status : 400, message : [ 'Bad Request' ] } ) } ).not.toThrowYnnHttpException( new HttpException( {
            status : 400,
            message : [ 'Something Error' ]
        } ) );
    } );
} );
