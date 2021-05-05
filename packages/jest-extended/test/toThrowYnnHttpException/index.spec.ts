/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: toThrowYnnHttpException/index.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/26/2021
 * Description:
 ******************************************************************/

import { HttpException } from '@ynn/exceptions';
import matchers from '../../src/matchers';

expect.extend( matchers );

describe( '.toThrowYnnHttpException', () => {
    it( 'passes when thrown an arbitrary HttpException', () => {
        expect( () => { throw new HttpException( 400 ) } ).toThrowYnnHttpException();
        expect( () => { throw new HttpException( 400, 'Something Error' ) } ).toThrowYnnHttpException();
        expect( () => { throw new HttpException( { status : 400, message : [ 'Something Error' ] } ) } ).toThrowYnnHttpException();
    } );

    it( 'passes when thrown a HttpException matched the expect HttpException instance', () => {
        expect( () => { throw new HttpException( 400 ) } ).toThrowYnnHttpException( new HttpException( 400 ) );
        expect( () => { throw new HttpException( 400, 'Something Error' ) } ).toThrowYnnHttpException( new HttpException( 400, 'Something Error' ) );
        const response = { status : 400, message : [ 'Something Error' ] };
        expect( () => { throw new HttpException( response ) } ).toThrowYnnHttpException( new HttpException( response ) );
    } );

    it( 'passes when thrown a HttpException and matched the given status', () => {
        expect( () => { throw new HttpException( 400 ) } ).toThrowYnnHttpException( 400 );
        expect( () => { throw new HttpException( 400, 'Something Error' ) } ).toThrowYnnHttpException( 400 );
        expect( () => { throw new HttpException( 400, 'Something Error' ) } ).toThrowYnnHttpException( 400 );
        expect( () => { throw new HttpException( { status : 400, message : [ 'Something Error' ] } ) } ).toThrowYnnHttpException( 400 );
    } );

    it( 'passes when thrown a HttpException and matched the given error message', () => {
        expect( () => { throw new HttpException( 400 ) } ).toThrowYnnHttpException( 'Bad Request' );
        expect( () => { throw new HttpException( 400, 'Something Error' ) } ).toThrowYnnHttpException( 'Something Error' );
        expect( () => { throw new HttpException( { status : 400, error : 'Something Error' } ) } ).toThrowYnnHttpException( 'Something Error' );
    } );

    it( 'passes when thrown a HttpException and matched both the given status and error message', () => {
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

    it( 'fails when thrown a HttpException but not matched the given HttpException instance', () => {
        expect( () => {
            expect( () => { throw new HttpException( 401 ) } ).toThrowYnnHttpException( new HttpException( 400 ) );
        } ).toThrowErrorMatchingSnapshot();
        expect( () => {
            expect( () => { throw new HttpException( 400, 'Something Error' ) } ).toThrowYnnHttpException( new HttpException( 400 ) );
        } ).toThrowErrorMatchingSnapshot();
    } );

    it( 'fails when thrown a HttpException and not matched the given status', () => {
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

    it( 'fails when thrown a HttpException and not matched the given error message', () => {
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

describe( '.rejects.toThrowYnnHttpException', () => {
    it( 'passes when the promise object rejected with an arbitrary HttpException instance', () => {
        expect( Promise.reject( new HttpException( 400 ) ) ).rejects.toThrowYnnHttpException();
    } );

    it( 'passes when the thrown HttpException matched the expected one', () => {
        const args = { status : 400, message : [ 'Something Error' ] };
        expect( Promise.reject( new HttpException( args ) ) ).rejects.toThrowYnnHttpException( new HttpException( args ) );
    } );

    it( 'passes when thrown a HttpException and matched the HttpException created with given object', () => {
        const args = { status : 400, message : [ 'Something Error' ] };
        expect( Promise.reject( new HttpException( args ) ) ).rejects.toThrowYnnHttpException( args );
    } );

    it( 'fails when the promise object not rejected with a HttpException instance', () => {
        expect( () => {
            return expect( Promise.reject( new Error() ) ).rejects.toThrowYnnHttpException();
        } ).rejects.toThrowErrorMatchingSnapshot();
    } );

    it( 'fails when the thrown HttpException did not match the expected one', () => {
        const args = { status : 400, message : [ 'Something Error' ] };
        expect( () => {
            return expect( Promise.reject( new HttpException( args ) ) ).rejects.toThrowYnnHttpException( new HttpException( 401 ) );
        } ).rejects.toThrowErrorMatchingSnapshot();
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

describe( '.rejects.not.toThrowYnnHttpException', () => {
    it( 'passes when the promise not rejected with a HttpException instance', () => {
        expect( Promise.reject( new Error ) ).rejects.not.toThrowYnnHttpException();
    } );

    it( 'passes when the thrown HttpException instance did not match the expected one', () => {
        expect( Promise.reject( new HttpException( 400 ) ) ).rejects.not.toThrowYnnHttpException( new HttpException( 401 ) );
    } );

    it( 'failes when the promise rejected with a HttpException instance', () => {
        expect( () => {
            return expect( Promise.reject( new HttpException( 400 ) ) ).rejects.not.toThrowYnnHttpException();
        } ).rejects.toThrowErrorMatchingSnapshot();
    } );

    it( 'fails when the thrown HttpException matched the expected one', () => {
        expect( () => {
            return expect( Promise.reject( new HttpException( 400 ) ) ).rejects.not.toThrowYnnHttpException( new HttpException( 400 ) );
        } ).rejects.toThrowErrorMatchingSnapshot();
    } );
} );
