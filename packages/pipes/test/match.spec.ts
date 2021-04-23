/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: test/match.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/22/2021
 * Description:
 ******************************************************************/

const mockedErrorMessage = 'Mocked Error';

jest.mock( '../src/shared/handle-validation-exception', () => ( {
    handleValidationException() {
        throw new Error( mockedErrorMessage );
    }
} ) );

import { ParameterMetadata, Pipe } from '@ynn/core';
import { HttpException } from '@ynn/http-exception';
import { createParameterMetadata, createContext } from '@ynn/testing';
import { Match } from '../src';

/**
 * mocked module
 */
import { handleValidationException } from '../src/shared/handle-validation-exception';


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
            const r1 = fn1( 'xstring', context, meta );
            try {
                expect( handleValidationException ).toHaveBeenCalledTimes( 1 );
            } catch( e: unknown ) { console.log( e ) };
            await expect( r1 ).rejects.toThrow( mockedErrorMessage );
            const r2 = fn1( 'stringx', context, meta );
            await expect( r2 ).rejects.toThrow( Error );
            const r3 = fn1( 'abc', context, meta );
            await expect( r3 ).rejects.toThrow( Error );
        } );

        xit( 'regexp pattern', async () => {
            await expect( fn2( 'abc', context, meta ) ).rejects.toThrow( HttpException );
            await expect( fn2( 2, context, meta ) ).rejects.toThrow( HttpException );
        } );

        xit( 'mixed patterns', async () => {
            await expect( fn3( 'abc', context, meta ) ).rejects.toThrow( HttpException );
            await expect( fn3( 2, context, meta ) ).rejects.toThrow( HttpException );
        } );

        xit( 'correct error message while metadata.property is not empty', async () => {
            expect.assertions( 2 );

            try { await fn1( 'abc', context, meta ) } catch( e: unknown ) {
                expect( e ).toHaveProperty( 'response', {
                    status : 400,
                    message : [ 'id should match "string"' ]
                } );
            }

            try { await fn2( 'abc', context, meta ) } catch( e: unknown ) {
                expect( e ).toHaveProperty( 'response', {
                    status : 400,
                    message : [ `id should match "${/regexp/.toString()}"` ]
                } );
            }
        } );

        xit( 'correct error message while metadata.property is empty', async () => {
            try { await fn1( 'a', context, createParameterMetadata() ) } catch( e: unknown ) {
                expect( e ).toHaveProperty( 'response', {
                    status : 400,
                    message : [ 'parameter does not match "string"' ]
                } );
            }
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
