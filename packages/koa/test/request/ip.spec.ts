/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 * 
 * File: request/ip.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/05/2020
 * Description: 
 ******************************************************************/

import assert from 'assert';
import Stream from 'stream';
import Koa from '../../src/application';
import context from '../helpers/context';

describe( 'req.ip', () => {
    describe( 'with req.ips present', () => {
        it( 'should return req.ips[ 0 ]', () => {
            const app = new Koa();
            const req = { headers: {}, socket: new Stream.Duplex() };
            app.proxy = true;
            req.headers[ 'x-forwarded-for' ] = '127.0.0.1';
            ( req.socket as any ).remoteAddress = '127.0.0.2';
            const request = context.request( req, undefined, app );
            assert.equal( request.ip, '127.0.0.1' );
        } );
    } );

    describe( 'with no req.ips present', () => {
        it( 'should return req.socket.remoteAddress', () => {
            const req = { socket: new Stream.Duplex() };
            ( req.socket as any ).remoteAddress = '127.0.0.2';
            const request = context.request( req );
            assert.equal( request.ip, '127.0.0.2' );
        } );

        describe( 'with req.socket.remoteAddress not present', () => {
            it( 'should return an empty string', () => {
                const socket = new Stream.Duplex();
                Object.defineProperty( socket, 'remoteAddress', {
                    get: () => undefined, // So that the helper doesn't override it with a reasonable value
                    set: () => {}
                } );
                assert.equal( context.request( { socket } ).ip, '' );
            } );
        } );
    } );

    it( 'should be lazy inited and cached', () => {
        const req = { socket: new Stream.Duplex() };
        ( req.socket as any ).remoteAddress = '127.0.0.2';
        const request = context.request( req );
        assert.equal( request.ip, '127.0.0.2' );
        ( req.socket as any ).remoteAddress = '127.0.0.1';
        assert.equal( request.ip, '127.0.0.2' );
    } );

    it( 'should reset ip work', () => {
        const req = { socket: new Stream.Duplex() };
        ( req.socket as any ).remoteAddress = '127.0.0.2';
        const request = context.request( req );
        assert.equal( request.ip, '127.0.0.2' );
        request.ip = '127.0.0.1';
        assert.equal( request.ip, '127.0.0.1' );
    } );
} );
