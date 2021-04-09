/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorators/status.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/15/2021
 * Description:
 ******************************************************************/

import statuses from 'statuses';
import { Action, Context } from '@ynn/core';
import { createAppWithRequest } from '@ynn/testing';
import { Status } from '../src';

describe( '@Status()', () => {
    describe( 'Response Decorator', () => {
        it( 'only set status code', async () => {
            class IndexController {
                constructor( public ctx: Context ) {}

                @Action()
                @Status( 304 )
                index() { return {} }
            }

            const ctx = await createAppWithRequest( {
                controllers : { index : IndexController }
            }, {
                request : {
                    method : 'GET',
                    url : '/'
                }
            } );

            expect( ctx.response.status ).toEqual( 304 );
            expect( ctx.response.message ).toEqual( statuses.message[ 304 ] );
        } );

        it( 'set both status code and status message', async () => {
            class IndexController {
                constructor( public ctx: Context ) {}

                @Action()
                @Status( 304, 'Message' )
                index() { return {} }
            }

            const ctx = await createAppWithRequest( {
                controllers : { index : IndexController }
            }, {
                request : {
                    method : 'GET',
                    url : '/'
                }
            } );

            expect( ctx.response.status ).toEqual( 304 );
            expect( ctx.response.message ).toEqual( 'Message' );
        } );

        it( 'set status code with handler function returns a status code', async () => {
            class IndexController {
                constructor( public ctx: Context ) {}

                @Action()
                @Status( () => 500 )
                index() { return {} }
            }

            const ctx = await createAppWithRequest( {
                controllers : { index : IndexController }
            }, {
                request : {
                    method : 'GET',
                    url : '/'
                }
            } );

            expect( ctx.response.status ).toEqual( 500 );
            expect( ctx.response.message ).toEqual( statuses.message[ 500 ] );
        } );

        it( 'set status code with handler function returns an object', async () => {
            class IndexController {
                constructor( public ctx: Context ) {}

                @Action()
                @Status( () => ( { code : 500 } ) )
                index() { return {} }
            }

            const ctx = await createAppWithRequest( {
                controllers : { index : IndexController }
            }, {
                request : {
                    method : 'GET',
                    url : '/'
                }
            } );

            expect( ctx.response.status ).toEqual( 500 );
            expect( ctx.response.message ).toEqual( statuses.message[ 500 ] );
        } );

        it( 'set both status code and status message with handler function returns an object', async () => {
            class IndexController {
                constructor( public ctx: Context ) {}

                @Action()
                @Status( () => ( { code : 500, message : 'Error' } ) )
                index() { return {} }
            }

            const ctx = await createAppWithRequest( {
                controllers : { index : IndexController }
            }, {
                request : {
                    method : 'GET',
                    url : '/'
                }
            } );

            expect( ctx.response.status ).toEqual( 500 );
            expect( ctx.response.message ).toEqual( 'Error' );
        } );

        it( 'should pass the Context object to the handler function', async () => {
            const fn = jest.fn();
            class IndexController {
                constructor( public ctx: Context ) {}

                @Action()
                @Status( fn )
                index() { return {} }
            }

            const ctx = await createAppWithRequest( {
                controllers : { index : IndexController }
            }, {
                request : {
                    method : 'GET',
                    url : '/'
                }
            } );

            expect( fn ).toHaveBeenCalledWith( ctx );
        } );

        it( 'should allow the handler function returns a Promise object', async () => {
            class IndexController {
                constructor( public ctx: Context ) {}

                @Action()
                @Status( async () => Promise.resolve( 500 ) )
                index() { return {} }
            }

            const ctx = await createAppWithRequest( {
                controllers : { index : IndexController }
            }, {
                request : {
                    method : 'GET',
                    url : '/'
                }
            } );

            expect( ctx.response.status ).toEqual( 500 );
            expect( ctx.response.message ).toEqual( statuses.message[ 500 ] );
        } );
    } );
} );
