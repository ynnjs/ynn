/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: test/required.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/13/2021
 * Description:
 ******************************************************************/

import { ParameterMetadata, Pipe } from '@ynn/core';
import { HttpException } from '@ynn/http-exception';
import { createParameterMetadata, createContext } from '@ynn/testing';
import { Required } from '../src';

describe( 'Required Pipe', () => {

    const context = createContext();

    const metadata = ( property = 'id', pipes: Pipe[] = [] ): ParameterMetadata => {
        return createParameterMetadata( {
            parameters : { property, pipes }
        } );
    };

    describe( 'default exception', () => {

        const fn = Required();
        const meta = metadata();

        it( 'should have returned a function', () => {
            expect( fn ).toBeInstanceOf( Function );
        } );

        it( 'should have returned the original given value', async () => {
            const data = {};
            expect( await fn( data ) ).toBe( data );
        } );

        it( 'should have thrown an error if the given value is null', () => {
            expect( fn( null, context, meta ) ).rejects( HttpException );
        } );

        xit( 'should have thrown an error if the given value is undefined', () => {
            expect( async () => { await fn( undefined, context, meta ) } ).toThrow( HttpException );
        } );

        xit( 'should have thrown HttpException with correct response', async () => {
            expect.assertions( 1 );

            try { await fn( undefined, context, meta ) } catch( e: unknown ) {
                expect( e ).toHaveProperty( 'response', {
                    status : 400,
                    message : [ 'id is required' ]
                } );
            }
        } );

        xit( 'should thrown HttpException with correct message if metadata.parameter.property is empty', async () => {
            expect.assertions( 1 );

            try { await fn( undefined, context, createParameterMetadata() ) } catch( e: unknown ) {
                expect( e ).toHaveProperty( 'response', {
                    status : 400,
                    message : [ 'missing parameter' ]
                } );
            }
        } );
    } );

    xdescribe( 'custom exception', () => {
        const fn = Required( new Error( 'something error' ) );
        const meta = metadata();

        it( 'should have thrown an error if the given value is null', () => {
            expect( async () => { await fn( null, context, meta ) } ).toThrow( Error );
            expect( async () => { await fn( null, context, meta ) } ).toThrow( 'something error' );
        } );

        it( 'should have thrown an error if the given value is undefined', () => {
            expect( async () => { await fn( undefined, context, meta ) } ).toThrow( Error );
            expect( async () => { await fn( undefined, context, meta ) } ).toThrow( 'something error' );
        } );

        it( 'should use the options for creating HttpException', async () => {
            expect.assertions( 1 );

            try {
                await Required( {
                    status : 401,
                    message : [ 'error message' ]
                } )( undefined, context, meta );
            } catch( e: unknown ) {
                expect( e ).toHaveProperty( 'response', {
                    status : 401,
                    message : [ 'error message' ]
                } );
            }
        } );
    } );

    xdescribe( 'callback function', () => {
        const meta = metadata();

        it( 'should have called the callback function', async () => {
            const fn = jest.fn();
            await Required( fn )( undefined, context, meta );
            expect( fn ).toHaveBeenCalledTimes( 1 );
        } );

        it( 'should have called the callback function with correct arguments', async () => {
            const fn = jest.fn();
            await Required( fn )( undefined, context, meta );
            expect( fn ).toHaveBeenCalledWith( undefined, context, meta );
        } );

        it( 'should throw the exception that thrown from the callback function', async () => {
            const fn = Required( () => { throw new Error( 'E' ) } );
            expect( fn( undefined, context, meta ) ).rejects( 'E' );
        } );

        it( 'should throw the exception', () => {
            // const fn = Required( () => Promise.reject( 'X' ) );
            // try {
            //     fn( undefined, context, meta );
            // } catch( e ) {}
        } );
    } );
} );
