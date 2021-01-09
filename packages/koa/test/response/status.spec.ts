/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 *
 * File: response/status.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/06/2020
 * Description:
 ******************************************************************/

import assert from 'assert';
import request from 'supertest';
import statuses from 'statuses';
import Koa from '../../src/application';
import { response } from '../helpers/context';

describe( 'res.status=', () => {
    describe( 'when a status code', () => {
        describe( 'and valid', () => {
            it( 'should set the status', () => {
                const res = response();
                res.status = 403;
                assert.equal( res.status, 403 );
            } );

            it( 'should not throw', () => {
                response().status = 403;
            } );
        } );

        describe( 'and invalid', () => {
            it( 'should throw', () => {
                assert.throws( () => {
                    response().status = 99;
                }, /invalid status code: 99/ );
            } );
        } );

        describe( 'and custom status', () => {
            beforeEach( () => statuses.message[ '700' ] = 'custom status' );

            it( 'should set the status', () => {
                const res = response();
                res.status = 700;
                assert.equal( res.status, 700 );
            } );

            it( 'should not throw', () => {
                response().status = 700;
            } );
        } );

        describe( 'and HTTP/2', () => {
            it( 'should not set the status message', () => {
                const res = response( {
                    'httpVersionMajor' : 2,
                    'httpVersion' : '2.0'
                } );
                res.status = 200;
                assert( !res.res.statusMessage );
            } );
        } );
    } );

    /**
     * I don't want to check the data type on the fly.
     * the data type should be checked by typescript compiler.
     */
    xdescribe( 'when a status string', () => {
        it( 'should throw', () => {
            assert.throws( () => response().status = 'forbidden', /status code must be a number/ );
        } );
    } );

    function strip( status ) {
        it( 'should strip content related header fields', async() => {
            const app = new Koa();

            app.use( ctx => {
                ctx.body = { foo : 'bar' };
                ctx.set( 'Content-Type', 'application/json; charset=utf-8' );
                ctx.set( 'Content-Length', '15' );
                ctx.set( 'Transfer-Encoding', 'chunked' );
                ctx.status = status;
                assert( ctx.response.header[ 'content-type' ] == null );
                assert( ctx.response.header[ 'content-length' ] == null );
                assert( ctx.response.header[ 'transfer-encoding' ] == null );
            } );

            const res = await request( app.callback() )
                .get( '/' )
                .expect( status );

            assert.equal( ( {} ).hasOwnProperty.call( res.headers, 'content-type' ), false );
            assert.equal( ( {} ).hasOwnProperty.call( res.headers, 'content-length' ), false );
            assert.equal( ( {} ).hasOwnProperty.call( res.headers, 'content-encoding' ), false );
            assert.equal( res.text.length, 0 );
        } );

        it( 'should strip content releated header fields after status set', async() => {
            const app = new Koa();

            app.use( ctx => {
                ctx.status = status;
                ctx.body = { foo : 'bar' };
                ctx.set( 'Content-Type', 'application/json; charset=utf-8' );
                ctx.set( 'Content-Length', '15' );
                ctx.set( 'Transfer-Encoding', 'chunked' );
            } );

            const res = await request( app.callback() )
                .get( '/' )
                .expect( status );

            assert.equal( ( {} ).hasOwnProperty.call( res.headers, 'content-type' ), false );
            assert.equal( ( {} ).hasOwnProperty.call( res.headers, 'content-length' ), false );
            assert.equal( ( {} ).hasOwnProperty.call( res.headers, 'content-encoding' ), false );
            assert.equal( res.text.length, 0 );
        } );
    }

    describe( 'when 204', () => strip( 204 ) );

    describe( 'when 205', () => strip( 205 ) );

    describe( 'when 304', () => strip( 304 ) );
} );
