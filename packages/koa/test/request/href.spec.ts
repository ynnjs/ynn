/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 * 
 * File: request/href.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/05/2020
 * Description: 
 ******************************************************************/

import http from 'http';
import assert from 'assert';
import Stream from 'stream';
import { Server } from 'net';
import Koa from '../../src/application';
import context from '../helpers/context';

describe( 'ctx.href', () => {
    it( 'should return the full request url', () => {
        const socket = new Stream.Duplex();
        const req = {
            url: '/users/1?next=/dashboard',
            headers: {
                host: 'localhost'
            },
            socket: socket,
            __proto__: Stream.Readable.prototype
        };
        const ctx = context( req );
        assert.equal( ctx.href, 'http://localhost/users/1?next=/dashboard' );
        // change it also work
        ctx.url = '/foo/users/1?next=/dashboard';
        assert.equal( ctx.href, 'http://localhost/users/1?next=/dashboard' );
    } );

    it( 'should work with `GET http://example.com/foo`', done => {
        const app = new Koa();
        app.use( ctx => {
            ctx.body = ctx.href;
        } );
        app.listen( function( this: Server ) {
            const address = this.address();
            http.get( {
                host: 'localhost',
                path: 'http://example.com/foo',
                port: ( address as any )?.port
            }, res => {
                assert.equal( res.statusCode, 200 );
                let buf = '';
                res.setEncoding( 'utf8' );
                res.on( 'data', s => buf += s );
                res.on( 'end', () => {
                    assert.equal( buf, 'http://example.com/foo' );
                    done();
                } );
            } );
        } );
    } );
} );
