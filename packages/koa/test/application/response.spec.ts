/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 * 
 * File: application/response.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/06/2020
 * Description: 
 ******************************************************************/

import assert from 'assert';
import request from 'supertest';
import Koa from '../../src/application';

const RESPOND_EXPLICIT_NULL_BODY = Symbol.for( 'respond#explicit#null#body' );

describe( 'app.response', () => {
    const app1 = new Koa();
    app1.response.msg = 'hello';
    const app2 = new Koa();
    const app3 = new Koa();
    const app4 = new Koa();
    const app5 = new Koa();

    it( 'should merge properties', () => {
        app1.use( ctx => {
            assert.equal( ctx.response.msg, 'hello' );
            ctx.status = 204;
        } );

        return request( app1.callback() )
            .get( '/' )
            .expect( 204 );
    } );

    it( 'should not affect the original prototype', () => {
        app2.use( ctx => {
            assert.equal( ctx.response.msg, undefined );
            ctx.status = 204;
        } );

        return request( app2.callback() )
            .get( '/' )
            .expect( 204 );
    } );

    it( 'should not include status message in body for http2', async() => {
        app3.use( ctx => {
            ctx.req.httpVersionMajor = 2;
            ctx.status = 404;
        } );
        const response = await request( app3.callback() )
            .get( '/' )
            .expect( 404 );
        assert.equal( response.text, '404' );
    } );

    it( 'should set [ RESPOND_EXPLICIT_NULL_BODY ] correctly', async() => {
        app4.use( ctx => {
            ctx.body = null;
            assert.strictEqual( ctx.response[ RESPOND_EXPLICIT_NULL_BODY ] , true );
        } );

        return request( app4.callback() )
            .get( '/' )
            .expect( 204 );
    } );

    it( 'should not set ._explicitNullBody incorrectly', async() => {
        app5.use( ctx => {
            ctx.body = undefined;
            assert.strictEqual( ctx.response._explicitNullBody, undefined );
            ctx.body = '';
            assert.strictEqual( ctx.response._explicitNullBody, undefined );
            ctx.body = false;
            assert.strictEqual( ctx.response._explicitNullBody, undefined );
        } );

        return request( app5.callback() )
            .get( '/' )
            .expect( 204 );
    } );
} );
