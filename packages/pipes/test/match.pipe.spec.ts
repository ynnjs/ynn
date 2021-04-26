/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: test/match.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/22/2021
 * Description:
 ******************************************************************/

import { ParameterMetadata, Pipe } from '@ynn/core';
import { createParameterMetadata, createContext } from '@ynn/testing';
import { Match } from '../src';

describe( 'Match Pipe', () => {

    const context = createContext();

    const metadata = ( property = 'id', pipes: Pipe[] = [] ): ParameterMetadata => {
        return createParameterMetadata( {
            parameters : { property, pipes }
        } );
    };

    describe( 'pass validation', () => {
        it( 'matches a string', async () => {
            await expect( Match( 'abc' )( 'abc', context, metadata ) ).resolves.toEqual( 'abc' );
        } );

        it( 'matches a RegExp', async () => {
            await expect( Match( /abc/ )( 'abc', context, metadata ) ).resolves.toEqual( 'abc' );
        } );

        it( 'matches a list of string, and RegExp', async () => {
            const fn = Match( [ /abc/, 'def' ] );
            await expect( fn( 'abc', context, metadata ) ).resolves.toEqual( 'abc' );
            await expect( fn( 'def', context, metadata ) ).resolves.toEqual( 'def' );
        } );

        it( 'should convert number to string', async () => {
            await expect( Match( '123' )( 123, context, metadata ) ).resolves.toEqual( 123 );
        } );
    } );

    describe( 'default exception', () => {

        const fn1 = Match( 'string' );
        const fn2 = Match( /regexp/ );
        const fn3 = Match( [ 'string', /regexp/ ] );
        const meta = metadata();

        it( 'string pattern', async () => {
            const defaultExceptionResponse = {
                status : 400,
                message : [ 'id should match "string"' ]
            };

            await expect( fn1( 'xstring', context, meta ) ).rejects.toThrowYnnHttpException( defaultExceptionResponse );
            await expect( fn1( 'stringx', context, meta ) ).rejects.toThrowYnnHttpException( defaultExceptionResponse );
            await expect( fn1( 'abc', context, meta ) ).rejects.toThrowYnnHttpException( defaultExceptionResponse );
        } );

        it( 'regexp pattern', async () => {
            const defaultExceptionResponse = {
                status : 400,
                message : [ `id should match "${/regexp/.toString()}"` ]
            };

            await expect( fn2( 'abc', context, meta ) ).rejects.toThrowYnnHttpException( defaultExceptionResponse );
            await expect( fn2( 2, context, meta ) ).rejects.toThrowYnnHttpException( defaultExceptionResponse );
        } );

        it( 'mixed patterns', async () => {

            const defaultExceptionResponse = {
                status : 400,
                message : [ 'id should match the given patterns' ]
            };

            await expect( fn3( 'abc', context, meta ) ).rejects.toThrowYnnHttpException( defaultExceptionResponse );
            await expect( fn3( 2, context, meta ) ).rejects.toThrowYnnHttpException( defaultExceptionResponse );
        } );

        it( 'correct error message while metadata.property is not empty', async () => {
            await expect( fn1( 'abc', context, meta ) ).rejects.toThrowYnnHttpException( {
                status : 400,
                message : [ 'id should match "string"' ]
            } );

            await expect( fn2( 'abc', context, meta ) ).rejects.toThrowYnnHttpException( {
                status : 400,
                message : [ `id should match "${/regexp/.toString()}"` ]
            } );
        } );

        it( 'correct error message while metadata.property is empty', async () => {
            await expect( fn1( 'a', context, createParameterMetadata() ) ).rejects.toThrowYnnHttpException( {
                status : 400,
                message : [ 'parameter does not match "string"' ]
            } );
        } );

    } );

    describe( 'callback function', () => {
        const meta = metadata();
        it( 'should have called the callback function', async () => {
            const fn = jest.fn();
            await Match( 'string', fn )( 'x', context, meta );
            expect( fn ).toHaveBeenCalledTimes( 1 );
        } );

        it( 'should have called the callback function with correct arguments', async () => {
            const fn = jest.fn();
            await Match( 'string', fn )( 'x', context, meta );
            expect( fn ).toHaveBeenCalledWith( 'x', context, meta );
        } );

        it( 'should have thrown the exception thrown from the callback function', async () => {
            const fn = async () => Promise.reject( new Error( 'something error' ) );
            return expect( Match( 'string', fn )( 'x', context, meta ) ).rejects.toThrow( 'something error' );
        } );

        it( 'should have been resolved with the return value of the callback function', async () => {
            const fn = () => 'ok';
            return expect( Match( 'string', fn )( 'x', context, meta ) ).resolves.toEqual( 'ok' );
        } );
    } );
} );
