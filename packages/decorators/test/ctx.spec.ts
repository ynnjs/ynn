/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorators/ctx.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/14/2021
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import { IncomingHttpHeaders } from 'http';
import { KEY_BEFORE } from '@ynn/method-interceptor';
import { Action, Context } from '@ynn/core';
import { createAppWithRequest } from '@ynn/testing';
import { Ctx } from '../src';

describe( 'decorator/ctx', () => {
    describe( 'Method decorator', () => {
        it( '@Ctx()', () => {
            class Controller {
                @Ctx()
                action() {}
            }

            const descriptor = Reflect.getOwnPropertyDescriptor( Controller.prototype, 'action' )!;

            const metadata = Reflect.getMetadata( KEY_BEFORE, descriptor.value );

            expect( metadata ).toBeInstanceOf( Array );
            expect( metadata[ 0 ].interceptorType ).toEqual( 'before' );
        } );
    } );

    describe( 'Parameter Decorator', () => {
        it( '', async () => {

            const fn1 = jest.fn();
            const fn2 = jest.fn();
            const res = { status : 0, message : 'OK' };

            class IndexController {
                constructor( public ctx: Context ) {}

                @Action()
                index(
                    @Ctx() ctx: Context,
                    @Ctx( 'headers' ) headers: IncomingHttpHeaders
                ) {
                    fn1( ctx );
                    fn2( headers );
                    return res;
                }
            }

            const ctx: Context = await createAppWithRequest( {
                controllers : { index : IndexController }
            }, {
                request : {
                    method : 'GET',
                    url : '/?name=Achilles',
                    headers : {
                        'Content-Type' : 'application/json'
                    }
                }
            } );

            expect( fn1 ).toHaveBeenCalled();
            expect( fn1 ).toHaveBeenCalledWith( ctx );
            expect( fn2 ).toHaveBeenCalled();
            expect( fn2 ).toHaveBeenCalledWith( { 'content-type' : 'application/json' } );
            expect( ctx.body ).toEqual( res );
            expect( ctx.response.headers ).toEqual( { 'content-type' : 'application/json; charset=utf-8' } );
            expect( ctx.response.status ).toEqual( 200 );
            expect( ctx.response.message ).toEqual( 'OK' );

        } );
    } );
} );
