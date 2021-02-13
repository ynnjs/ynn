/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptors/body.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/29/2021
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import { Context } from '@ynn/waka';
import { createContext } from '@ynn/testing-library';
import { body } from '../../../src/interceptors/before';


describe( 'interceptor/body', () => {

    it( '', async () => {

        const fn1 = jest.fn();
        const fn2 = jest.fn();

        const ctx = createContext( {
            body : {
                name : 'Achilles'
            }
        } );
        await body( {
            interceptorType : 'before',
            parameters : {
                property : 'name',
                pipes : [
                    ( value: unknown, ctx: Context ) => {
                        fn1( value, ctx );
                        return value.toUpperCase();
                    },

                    ( value: unknown, ctx: Context ) => {
                        fn2( value, ctx );
                    }
                ]
            }
        }, ctx );

        expect( fn1 ).toHaveBeenCalled();
        expect( fn2 ).toHaveBeenCalled();
    } );

} );
