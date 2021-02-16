/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorators/query.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/31/2021
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import { KEY_BEFORE } from '@ynn/method-interceptor';
import { Action, Context, Controller } from '@ynn/waka';
import { createAppWithRequest } from '@ynn/testing-library';
import { Query } from '../../src';

describe( 'decorator/query', () => {
    describe( 'Method decorator', () => {
        it( '@Query()', () => {
            class Controller {
                @Query()
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
            const fn3 = jest.fn();
            const res = { status : 0, message : 'OK' };

            class IndexController implements Controller {
                constructor( public ctx: Context ) {}

                @Action()
                index(
                    @Query( 'name' ) name: string,
                    @Query() query: Record<string, string>,
                    @Query( 'age', ( v: string ): number => parseInt( v ) ) age: number
                ) {
                    fn1( name );
                    fn2( query );
                    fn3( age );
                    return res;
                }
            }

            const ctx: Context = await createAppWithRequest( {
                controllers : { index : IndexController }
            }, {
                request : {
                    method : 'GET',
                    url : '/?name=Achilles&age=13'
                }
            } );

            expect( fn1 ).toHaveBeenCalled();
            expect( fn1 ).toHaveBeenCalledWith( 'Achilles' );
            expect( fn2 ).toHaveBeenCalled();
            expect( fn2 ).toHaveBeenCalledWith( { name : 'Achilles', age : '13' } );
            expect( fn3 ).toHaveBeenCalled();
            expect( fn3 ).toHaveBeenCalledWith( 13 );
            expect( ctx.body ).toEqual( res );
            expect( ctx.response.headers ).toEqual( { 'content-type' : 'application/json; charset=utf-8' } );
            expect( ctx.response.status ).toEqual( 200 );
            expect( ctx.response.message ).toEqual( 'OK' );

        } );
    } );
} );
