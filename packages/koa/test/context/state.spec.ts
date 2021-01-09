/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: context/state.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/05/2020
 * Description:
 ******************************************************************/

import assert from 'assert';
import request from 'supertest';
import Koa from '../../src/application';

describe( 'ctx.state', () => {
    it( 'should provide a ctx.state namespace', () => {
        const app = new Koa();

        app.use( ctx => {
            assert.deepEqual( ctx.state, {} );
        } );

        return request( app.callback() )
            .get( '/' )
            .expect( 404 );
    } );
} );
