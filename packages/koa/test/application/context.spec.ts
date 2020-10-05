/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 * 
 * File: application/context.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/06/2020
 * Description: 
 ******************************************************************/

import assert from 'assert';
import request from 'supertest';
import Koa from '../../src/application';

describe( 'app.context', () => {
    const app1 = new Koa();
    app1.context.msg = 'hello';
    const app2 = new Koa();

    it( 'should merge properties', () => {
        app1.use( ctx => {
            assert.equal( ctx.msg, 'hello' );
            ctx.status = 204;
        } );

        return request( app1.callback() )
            .get( '/' )
            .expect( 204 );
    } );

    it( 'should not affect the original prototype', () => {
        app2.use( ctx => {
            assert.equal( ctx.msg, undefined );
            ctx.status = 204;
        } );

        return request( app2.callback() )
            .get( '/' )
            .expect( 204 );
    } );
} );
