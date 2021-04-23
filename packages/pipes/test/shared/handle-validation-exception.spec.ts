/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: shared/handle-validation-exception.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/23/2021
 * Description:
 ******************************************************************/

import { HttpException } from '@ynn/http-exception';
import { createContext, createParameterMetadata } from '@ynn/testing';
import { handleValidationException } from '../../src/shared/handle-validation-exception';

describe( 'shared/handle-validation-exception', () => {

    const context = createContext();
    const metadata = createParameterMetadata();

    const wrapper = handleValidationException.bind( null, 'value', context, metadata );

    it( 'should throw an HttpException by default', () => {
        expect( () => wrapper( {} ) ).toThrow( HttpException );
    } );

    it( 'should have called the callback function', () => {
        const fn = jest.fn();
        wrapper( {}, fn );
        expect( fn ).toHaveBeenCalledTimes( 1 );
    } );

    it( 'should have called the callback function with correct arguments', () => {
        const fn = jest.fn();
        wrapper( {}, fn );
        expect( fn ).toHaveBeenCalledWith( 'value', context, metadata );
    } );

    it( 'should throw the exception which was thrown from the callback function', async () => {
        const fn = () => wrapper( {}, () => { throw new Error( 'E' ) } );
        expect( fn ).toThrow( 'E' );
    } );

    it( 'should return the rejected promise object', async () => {
        await expect( wrapper( {}, async () => Promise.reject( new Error( 'E' ) ) ) ).rejects.toThrow( 'E' );
    } );

    it( 'should overwrite information of the thrown exception with given options', async () => {
        expect.assertions( 1 );

        try {
            wrapper( {
                status : 400,
                message : 'default message'
            }, {
                status : 401,
                message : 'new message'
            } );
        } catch( e: unknown ) {
            expect( e ).toHaveProperty( 'response', {
                status : 401,
                message : 'new message'
            } );
        }
    } );
} );
