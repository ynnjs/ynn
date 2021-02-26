/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorators/response.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/15/2021
 * Description:
 ******************************************************************/

import { Action, Context, Controller } from '@ynn/core';
import { createAppWithRequest } from '@ynn/testing-library';
import { Response } from '../src';

describe( '@Response()', () => {

    it( 'overwrite the response data', async () => {
        const res = { status : 0, message : 'OK' };

        class IndexController implements Controller {
            constructor( public ctx: Context ) {}

            @Action()
            @Response( res )
            index() { return {} }
        }

        const ctx = await createAppWithRequest( {
            controllers : { index : IndexController }
        }, {
            request : { method : 'GET', url : '/' }
        } );

        expect( ctx.body ).toEqual( res );
    } );

    it( 'transform response data with Pipes', async () => {
        const res = { name : 'Achilles' };

        class IndexController implements Controller {
            constructor( public ctx: Context ) {}

            @Action()
            @Response( ( data: unknown ) => ( { status : 0, message : 'OK', data } ) )
            index() { return res }
        }

        const ctx = await createAppWithRequest( {
            controllers : { index : IndexController }
        }, {
            request : { method : 'GET', url : '/' }
        } );

        expect( ctx.body ).toEqual( { status : 0, message : 'OK', data : res } );
    } );
} );

