/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 *
 * File: response/header.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/06/2020
 * Description:
 ******************************************************************/

import assert from 'assert';
import request from 'supertest';
import Koa from '../../src/application';
import { response } from '../helpers/context';

describe( 'res.header', () => {
    it( 'should return the response header object', () => {
        const res = response();
        res.set( 'X-Foo', 'bar' );
        res.set( 'X-Number', 200 );
        assert.deepEqual( res.header, { 'x-foo' : 'bar', 'x-number' : '200' } );
    } );

    it( 'should use res.getHeaders() accessor when available', () => {
        const res = response();
        res.res._headers = null;
        res.res.getHeaders = () => ( { 'x-foo' : 'baz' } );
        assert.deepEqual( res.header, { 'x-foo' : 'baz' } );
    } );

    it( 'should return the response header object when no mocks are in use', async() => {
        const app = new Koa();
        let header;

        app.use( ctx => {
            ctx.set( 'x-foo', '42' );
            header = Object.assign( {}, ctx.response.header );
        } );

        await request( app.callback() )
            .get( '/' );

        assert.deepEqual( header, { 'x-foo' : '42' } );
    } );

    describe( 'when headers not present', () => {
        it( 'should return empty object', () => {
            const res = response();
            assert.deepEqual( res.header, {} );
        } );
    } );
} );
