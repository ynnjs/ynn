/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: test/index.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/17/2020
 * Description: 
 ******************************************************************/

import createError from 'http-errors';
import assert from '../src';

describe( 'basic', () => {
    it( 'assert', () => {
        expect( assert( 'a' ).value() ).toEqual( 'a' );
        expect( assert( 'a', 400 ).value() ).toEqual( 'a' );
        expect( () => assert( undefined, 400 ).required() ).toThrow( createError( 400 ) );
    } );

    it( 'error', () => {
        expect( () => assert( false, 400 ).integer().value() ).toThrow( createError( 400 ) );
    } );
} );

describe( 'Methods', () => {
   
    it( 'default', () => {
        expect( assert( null ).default( 'x' ).value() ).toEqual( 'x' );
        expect( assert( null ).default( 'x' ).custom( () => false ).value() ).toEqual( 'x' );
        expect( assert( 'a' ).default( 'x' ).custom( () => false ).value() ).toEqual( 'x' );
        expect( assert( 'a' ).default().int().value() ).toEqual( undefined );
    } );

    it( 'required', () => {
        try {
            assert( undefined ).required().value();
        } catch( e ) {
            expect( e.message ).toEqual( 'Bad Request' );
            expect( e.status ).toEqual( 400 );
        }

        try {
            assert( undefined ).required( 300, 'xxx' ).value();
        } catch( e ) {
            expect( e.message ).toEqual( 'xxx' );
            expect( e.status ).toEqual( 300 );
        }
    } );

    it( 'length', () => {
        expect( assert( 'abc' ).length( [ 0, 3 ] ) ).toBeTruthy();
        expect( () => assert( 'abc', 400 ).length( [ 0, 1 ] ) ).toThrow();
        expect( assert( 'abc' ).length( 3 ) ).toBeTruthy();
        expect( () => assert( 'abc' ).length( 4 ) ).toThrow();
    } );

    it( 'regex', () => {
        expect( assert( '122' ).regex( /^\d+$/ ) ).toBeTruthy();
        expect( () => assert( '12a', 400 ).regex( /^\d+$/ ) ).toThrow();
    } );

    it( 'deepEqual', () => {
        expect( assert( { a : 1 } ).deepEqual( { a : 1 } ) ).toBeTruthy();
        expect( () => assert( { a : 1 }, 400 ).deepEqual( { a : 1, b : 2 } ) ).toThrow();
    } );

    describe( 'json', () => {

        it( 'should return correct value while content-type is json', () => {
            const x = { a : 1 };
            expect( assert( x ).json( 'application/json' ).value() ).toEqual( x );
        } );
    } );

    describe( 'Assertion.object()', () => {

        it( 'should support general object', () => {
            expect( assert( {} ).object().value() ).toEqual( {} ); 
        } );

        it( 'should not be null', () => {
            expect( () => assert( null ).object().value() ).toThrow(); 
        } );

        it( 'should not be array', () => {
            expect( () => assert( [] ).object().value() ).toThrow(); 
        } );
        
    } );

    describe( 'jsonstring', () => {

        it( 'should mutate the value by default', () => {
            const json = { a : 1 };
            expect( assert( JSON.stringify( json ) ).jsonstring().value() ).toEqual( json );
        } );

        it( 'should not mutate the value if set the first argument to false', () => {
            const json = JSON.stringify( { a : 1 } );

            expect( assert( json ).jsonstring( false ).value() ).toEqual( json );
        } );

        it( 'should use the customized status code', () => {
            expect( () => assert( '{a:1}', 400 ).jsonstring() ).toThrow( createError( 400 ) );
        } );

        it( 'should use the customized message', () => {
            const msg = 'Four Hundred';
            expect( () => assert( '{a:1}', 400, msg ).jsonstring() ).toThrow( createError( 400, msg ) );
        } );
    } );

    it( 'custom sync', () => {
        expect( assert( 'a' ).custom( () => true ) ).toBeTruthy();
        expect( () => assert( 'a' ).custom( () => false, 401, 'e' ) ).toThrow( createError( 401, 'e' ) );
    } );

    it( 'custom async pass', () => {

        return expect( assert( 'a' ).custom( () => Promise.resolve( true ) ).value() ).resolves.toEqual( 'a' );
         
    } );

    it( 'custom async error', () => {
        return expect( assert( 'a' ).custom( () => Promise.reject( true ) ).value() ).rejects.toThrow();
         
    } );

    it( 'between', () => {
        expect( assert( '2', 400 ).between( 0, 4 ) ).toBeTruthy();
        expect( () => assert( '10', 400 ).between( 0, 4 ) ).toThrow();
    } );

    describe( 'Assertion.in()', () => {
        it( 'should return correct value', () => {
            expect( assert( 'x', 400 ).in( [ 'x', 'y' ] ).value() ).toEqual( 'x' );
        } );

        it( 'should do loose value check', () => {
            expect( assert( '3', 400 ).in( [ 3, 'x', 'y' ] ).value() ).toEqual( '3' );
        } );

        it( 'should throw error', () => {
            expect( () => assert( '4', 400 ).in( [] ).value() ).toThrow( createError( 400 ) );
        } );
    } );

    it( 'Assertion.integer()', () => {
        expect( assert( '100', 400 ).integer() ).toBeTruthy();
        expect( () => assert( '1.1', 400 ).integer() ).toThrow();
    } );

    describe( 'Assertion.integer()', () => {
        
        it( 'should return correct value', () => {
            expect( assert( 100, 400 ).integer().value() ).toEqual( 100 );
        } );

        it( 'should transform String to number as default', () => {
            expect( assert( '100', 400 ).integer().value() ).toEqual( 100 );
        } );

        it( 'should throw error', () => {
            expect( () => assert( '100.', 400 ).integer().value() ).toThrow( createError( 400 ) );
        } );

        it( 'should not transform string to number if the first param is set to false', () => {
            expect( assert( '100', 400 ).integer( false ).value() ).toEqual( '100' );
        } );

        it( 'should ha alias Assertion.int()', () => {
            expect( assert( '100', 400 ).int() ).toBeTruthy();
            expect( () => assert( '1.1', 400 ).int() ).toThrow();
        } );
    } );

    it( 'is number', () => {
        expect( assert( '100.001', 400 ).number() ).toBeTruthy();
        expect( () => assert( '1.x', 400 ).number() ).toThrow();
    } );

    it( 'url', () => {
        expect( assert( 'http://www.baidu.com', 400 ).url() ).toBeTruthy();
        expect( () => assert( '127.0.0.1', 400 ).url() ).toThrow();
    } );

    it( 'get undefined value', () => {
        expect( assert( undefined ).value() ).toBeUndefined();
    } );

    it( 'undefined', () => {
        expect( assert( undefined ).int().value() ).toBeUndefined();
        expect( assert( undefined ).json().value() ).toBeUndefined();
    } );
} );
