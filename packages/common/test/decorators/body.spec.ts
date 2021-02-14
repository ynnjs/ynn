/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/body.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/21/2020
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import { KEY_BEFORE } from '@ynn/method-interceptor';
import { Action, Context, Controller } from '@ynn/waka';
import { createAppWithRequest } from '@ynn/testing-library';
import { Body } from '../../src';

describe( 'decorator/body', () => {
    describe( 'Method decorator', () => {
        it( '@Body()', () => {
            class Controller {
                @Body()
                action() {}
            }

            const descriptor = Reflect.getOwnPropertyDescriptor( Controller.prototype, 'action' )!;

            const metadata = Reflect.getMetadata( KEY_BEFORE, descriptor.value );

            console.log( metadata );
        } );
    } );

    describe( 'Parameter Decorator', () => {
        it( '', async () => {

            const fn1 = jest.fn();
            const res = { status : 0, message : 'OK' };

            class IndexController implements Controller {
                constructor( public ctx: Context ) {}

                @Action()
                index( @Body( 'name' ) name: string ) {
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
