/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: test/match.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/22/2021
 * Description:
 ******************************************************************/

import { ParameterMetadata, Pipe } from '@ynn/core';
import { HttpException } from '@ynn/http-exception';
import { createParameterMetadata, createContext } from '@ynn/testing';
import { Match } from '../src';

/**
 * mocked module
 */
import { handleValidationException } from '../src/shared/handle-validation-exception';

const mockedErrorMessage = 'Mocked Error';

jest.mock( '../src/shared/handle-validation-exception', () => ( {
    handleValidationException : jest.fn( () => {
        throw new Error( mockedErrorMessage );
    } )
} ) );

describe( 'Match Pipe', () => {

    const context = createContext();

    const metadata = ( property = 'id', pipes: Pipe[] = [] ): ParameterMetadata => {
        return createParameterMetadata( {
            parameters : { property, pipes }
        } );
    };

    afterEach( () => {
        jest.clearAllMocks();
    } );

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

            const args1 = [ 'xstring', context, meta ];
            const r1 = fn1( ...args1 );
            await expect( r1 ).rejects.toThrow( mockedErrorMessage );
            expect( handleValidationException ).toHaveBeenCalledTimes( 1 );
            expect( handleValidationException ).toHaveBeenCalledWith( ...[ ...args1, defaultExceptionResponse, undefined ] );

            const args2 = [ 'stringx', context, meta ];
            const r2 = fn1( ...args2 );
            expect( handleValidationException ).toHaveBeenCalledTimes( 2 );
            expect( handleValidationException ).toHaveBeenCalledWith( ...[ ...args2, defaultExceptionResponse, undefined ] );
            await expect( r2 ).rejects.toThrow( Error );

            const args3 = [ 'abc', context, meta ];
            const r3 = fn1( ...args3 );
            expect( handleValidationException ).toHaveBeenCalledTimes( 3 );
            expect( handleValidationException ).toHaveBeenCalledWith( ...[ ...args3, defaultExceptionResponse, undefined ] );
            await expect( r3 ).rejects.toThrow( Error );
        } );

        it( 'regexp pattern', async () => {

            const defaultExceptionResponse = {
                status : 400,
                message : [ `id should match "${/regexp/.toString()}"` ]
            };

            const args1 = [ 'abc', context, meta ];
            await expect( fn2( ...args1 ) ).rejects.toThrow( mockedErrorMessage );
            expect( handleValidationException ).toHaveBeenCalledWith( ...[ ...args1, defaultExceptionResponse, undefined ] );
            expect( handleValidationException ).toHaveBeenCalledTimes( 1 );

            const args2 = [ 2, context, meta ];
            await expect( fn2( ...args2 ) ).rejects.toThrow( mockedErrorMessage );
            expect( handleValidationException ).toHaveBeenCalledWith( ...[ ...args2, defaultExceptionResponse, undefined ] );
            expect( handleValidationException ).toHaveBeenCalledTimes( 2 );
        } );

        it( 'mixed patterns', async () => {

            const defaultExceptionResponse = {
                status : 400,
                message : [ 'id should match the given patterns' ]
            };

            const args1 = [ 'abc', context, meta ];
            await expect( fn3( ...args1 ) ).rejects.toThrow( mockedErrorMessage );
            expect( handleValidationException ).toHaveBeenCalledWith( ...[ ...args1, defaultExceptionResponse, undefined ] );
            expect( handleValidationException ).toHaveBeenCalledTimes( 1 );

            const args2 = [ 2, context, meta ];
            await expect( fn3( ...args2 ) ).rejects.toThrow( mockedErrorMessage );
            expect( handleValidationException ).toHaveBeenCalledWith( ...[ ...args2, defaultExceptionResponse, undefined ] );
            expect( handleValidationException ).toHaveBeenCalledTimes( 2 );
        } );

        it( 'correct error message while metadata.property is not empty', async () => {

            const args1 = [ 'abc', context, meta ];

            await expect( fn1( ...args1 ) ).rejects.toThrow( mockedErrorMessage );
            expect( handleValidationException ).toHaveBeenCalledWith( ...[ ...args1, {
                status : 400,
                message : [ 'id should match "string"' ]
            }, undefined ] );
            expect( handleValidationException ).toHaveBeenCalledTimes( 1 );

            const args2 = [ 'abc', context, meta ];
            await expect( fn2( ...args2 ) ).rejects.toThrow( mockedErrorMessage );
            expect( handleValidationException ).toHaveBeenCalledWith( ...[ ...args1, {
                status : 400,
                message : [ `id should match "${/regexp/.toString()}"` ]
            }, undefined ] );
            expect( handleValidationException ).toHaveBeenCalledTimes( 2 );
        } );

        it( 'correct error message while metadata.property is empty', async () => {
            const args = [ 'a', context, createParameterMetadata() ];
            await expect( fn1( ...args ) ).rejects.toThrow( mockedErrorMessage );
            expect( handleValidationException ).toHaveBeenCalledWith( ...[ ...args, {
                status : 400,
                message : [ 'parameter does not match "string"' ]
            }, undefined ] );
            expect( handleValidationException ).toHaveBeenCalledTimes( 1 );
        } );

    } );

    xdescribe( 'callback function', () => {
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
    } );
} );
