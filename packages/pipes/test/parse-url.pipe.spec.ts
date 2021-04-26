/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: test/parse-url.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/26/2021
 * Description:
 ******************************************************************/

import { ParameterMetadata, Pipe } from '@ynn/core';
import { createParameterMetadata, createContext } from '@ynn/testing';
import { ParseURL } from '../src';

describe( 'ParseURL Pipe', () => {
    const url = 'https://www.google.com';
    const context = createContext();
    const metadata = ( property = 'id', pipes: Pipe[] = [] ): ParameterMetadata => {
        return createParameterMetadata( {
            parameters : { property, pipes }
        } );
    };

    it( 'should return a function', () => {
        expect( ParseURL() ).toBeInstanceOf( Function );
    } );

    it( 'should return an instance of URL', async () => {
        expect( await ParseURL()( url, context, metadata() ) ).toBeInstanceOf( URL );
    } );
} );
