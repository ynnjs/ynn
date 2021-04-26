/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: test/required.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/13/2021
 * Description:
 ******************************************************************/

import { ParameterMetadata, Pipe } from '@ynn/core';
import { createParameterMetadata, createContext } from '@ynn/testing';
import { Required } from '../src';

describe( 'Required Pipe', () => {

    const context = createContext();

    const metadata = ( property = 'id', pipes: Pipe[] = [] ): ParameterMetadata => {
        return createParameterMetadata( {
            parameters : { property, pipes }
        } );
    };

    it( 'should have returned a function', () => {
        expect( Required() ).toBeInstanceOf( Function );
    } );

    it( 'should have returned the original given value', async () => {
        const data = {};
        expect( await Required()( data, context, metadata() ) ).toBe( data );
    } );

    it( 'should return the given value if the value is not undefined or null', async () => {
        await expect( Required()( 0, context, metadata() ) ).resolves.toEqual( 0 );
        await expect( Required()( '0', context, metadata() ) ).resolves.toEqual( '0' );
    } );

    describe( 'default exception', () => {

        const fn = Required();
        const meta = metadata();

        it( 'should have thrown an error if the given value is null', async () => {
            await expect( fn( null, context, meta ) ).rejects.toThrowYnnHttpException();
        } );

        it( 'should have thrown an error if the given value is undefined', async () => {
            await expect( fn( undefined, context, meta ) ).rejects.toThrowYnnHttpException();
        } );

        it( 'should have thrown exception if the given value is an empty string', async () => {
            await expect( fn( '', context, meta ) ).rejects.toThrowYnnHttpException();
        } );

        it( 'should have thrown HttpException with correct response', async () => {
            return expect( fn( undefined, context, meta ) ).rejects.toThrowYnnHttpException( {
                status : 400,
                message : [ 'id is required' ]
            } );
        } );

        it( 'should thrown HttpException with correct message if metadata.parameter.property is empty', async () => {
            return expect( fn( undefined, context, createParameterMetadata() ) ).rejects.toThrowYnnHttpException( {
                status : 400,
                message : [ 'missing parameter' ]
            } );
        } );
    } );

    describe( 'custom exception', () => {
        const fn = Required( new Error( 'something error' ) );
        const meta = metadata();

        it( 'should have thrown an error if the given value is null', async () => {
            await expect( fn( null, context, meta ) ).rejects.toThrow( Error );
            await expect( fn( null, context, meta ) ).rejects.toThrow( 'something error' );
        } );

        it( 'should have thrown an error if the given value is undefined', async () => {
            await expect( fn( undefined, context, meta ) ).rejects.toThrow( Error );
            await expect( fn( undefined, context, meta ) ).rejects.toThrow( 'something error' );
        } );

        it( 'should use the options for creating HttpException', async () => {
            const args = {
                status : 401,
                message : [ 'error message' ]
            };
            return expect( Required( args )( undefined, context, meta ) ).rejects.toThrowYnnHttpException( args );
        } );
    } );

    describe( 'callback function', () => {
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

        it( 'should throw the exception which was thrown from the callback function', async () => {
            const fn = Required( () => { throw new Error( 'E' ) } );
            await expect( fn( undefined, context, meta ) ).rejects.toThrow( 'E' );
        } );

        it( 'should return the rejected promise object', async () => {
            const fn = Required( async () => Promise.reject( new Error( 'E' ) ) );
            await expect( fn( undefined, context, meta ) ).rejects.toThrow( 'E' );
        } );

        it( 'should overwrite information of the thrown exception with given options', async () => {
            const fn = Required( { status : 401, message : [ 'something error' ] } );
            return expect( fn( undefined, context, meta ) ).rejects.toThrowYnnHttpException( {
                status : 401,
                message : [ 'something error' ]
            } );
        } );
    } );
} );
