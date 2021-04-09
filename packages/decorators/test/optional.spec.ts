/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: test/optional.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/24/2021
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import { Action, Context } from '@ynn/core';
import { createAppWithRequest } from '@ynn/testing';
import { Body, Optional } from '../src';

describe( 'decorator/body', () => {
    describe( 'Parameter Decorator', () => {
        it( '', async () => {

            const fn1 = jest.fn();
            const res = { status : 0, message : 'OK' };

            class IndexController {
                constructor( public ctx: Context ) {}

                @Action()
                index( @Optional() @Body( 'name' ) name: string ) {
                    fn1( name );
                    return res;
                }
            }

            const ctx: Context = await createAppWithRequest( {
                controllers : { index : IndexController }
            }, {
                request : {
                    method : 'GET',
                    url : '/',
                    body : { name : 'Achilles' }
                }
            } );

            expect( fn1 ).toHaveBeenCalled();
            expect( fn1 ).toHaveBeenCalledWith( 'Achilles' );
            expect( ctx.body ).toEqual( res );
            expect( ctx.response.headers ).toEqual( { 'content-type' : 'application/json; charset=utf-8' } );
            expect( ctx.response.status ).toEqual( 200 );
            expect( ctx.response.message ).toEqual( 'OK' );

        } );
    } );

} );
