/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 *
 * File: application/respond.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/06/2020
 * Description:
 ******************************************************************/

import fs from 'fs';
import assert from 'assert';
import request from 'supertest';
import statuses from 'statuses';
import pkg from '../../package.json';
import Koa from '../../src/application';

describe( 'app.respond', () => {
    describe( 'when ctx.respond === false', () => {
        it( 'should function ( ctx )', () => {
            const app = new Koa();

            app.use( ctx => {
                ctx.body = 'Hello';
                ctx.respond = false;

                const res = ctx.res;
                res.statusCode = 200;
                setImmediate( () => {
                    res.setHeader( 'Content-Type', 'text/plain' );
                    res.setHeader( 'Content-Length', '3' );
                    res.end( 'lol' );
                } );
            } );

            return request( app.callback() )
                .get( '/' )
                .expect( 200 )
                .expect( 'lol' );
        } );

        it( 'should ignore set header after header sent', () => {
            const app = new Koa();
            app.use( ctx => {
                ctx.body = 'Hello';
                ctx.respond = false;

                const res = ctx.res;
                res.statusCode = 200;
                res.setHeader( 'Content-Type', 'text/plain' );
                res.setHeader( 'Content-Length', '3' );
                res.end( 'lol' );
                ctx.set( 'foo', 'bar' );
            } );

            return request( app.callback() )
                .get( '/' )
                .expect( 200 )
                .expect( 'lol' )
                .expect( res => {
                    assert( !res.headers.foo );
                } );
        } );

        it( 'should ignore set status after header sent', () => {
            const app = new Koa();
            app.use( ctx => {
                ctx.body = 'Hello';
                ctx.respond = false;

                const res = ctx.res;
                res.statusCode = 200;
                res.setHeader( 'Content-Type', 'text/plain' );
                res.setHeader( 'Content-Length', '3' );
                res.end( 'lol' );
                ctx.status = 201;
            } );

            return request( app.callback() )
                .get( '/' )
                .expect( 200 )
                .expect( 'lol' );
        } );
    } );

    describe( 'when this.type === null', () => {
        it( 'should not send Content-Type header', async() => {
            const app = new Koa();

            app.use( ctx => {
                ctx.body = '';
                ctx.type = null;
            } );

            const res = await request( app.callback() )
                .get( '/' )
                .expect( 200 );

            assert.equal( Object.prototype.hasOwnProperty.call( res.headers, 'Content-Type' ), false );
        } );
    } );

    describe( 'when HEAD is used', () => {
        it( 'should not respond with the body', async() => {
            const app = new Koa();

            app.use( ctx => {
                ctx.body = 'Hello';
            } );

            const res = await request( app.callback() )
                .head( '/' )
                .expect( 200 );

            assert.equal( res.headers[ 'content-type' ], 'text/plain; charset=utf-8' );
            assert.equal( res.headers[ 'content-length' ], '5' );
            assert( !res.text );
        } );

        it( 'should keep json headers', async() => {
            const app = new Koa();

            app.use( ctx => {
                ctx.body = { hello : 'world' };
            } );

            const res = await request( app.callback() )
                .head( '/' )
                .expect( 200 );

            assert.equal( res.headers[ 'content-type' ], 'application/json; charset=utf-8' );
            assert.equal( res.headers[ 'content-length' ], '17' );
            assert( !res.text );
        } );

        it( 'should keep string headers', async() => {
            const app = new Koa();

            app.use( ctx => {
                ctx.body = 'hello world';
            } );

            const res = await request( app.callback() )
                .head( '/' )
                .expect( 200 );

            assert.equal( res.headers[ 'content-type' ], 'text/plain; charset=utf-8' );
            assert.equal( res.headers[ 'content-length' ], '11' );
            assert( !res.text );
        } );

        it( 'should keep buffer headers', async() => {
            const app = new Koa();

            app.use( ctx => {
                ctx.body = Buffer.from( 'hello world' );
            } );

            const res = await request( app.callback() )
                .head( '/' )
                .expect( 200 );

            assert.equal( res.headers[ 'content-type' ], 'application/octet-stream' );
            assert.equal( res.headers[ 'content-length' ], '11' );
            assert( !res.text );
        } );

        it( 'should keep stream header if set manually', async() => {
            const app = new Koa();

            const { length } = fs.readFileSync( 'package.json' );

            app.use( ctx => {
                ctx.length = length;
                ctx.body = fs.createReadStream( 'package.json' );
            } );

            const res = await request( app.callback() )
                .head( '/' )
                .expect( 200 );

            assert.equal( res.header[ 'content-length' ], length );
            assert( !res.text );
        } );

        it( 'should respond with a 404 if no body was set', () => {
            const app = new Koa();

            app.use( () => {} );

            return request( app.callback() )
                .head( '/' )
                .expect( 404 );
        } );

        it( 'should respond with a 200 if body = ""', () => {
            const app = new Koa();

            app.use( ctx => {
                ctx.body = '';
            } );

            return request( app.callback() )
                .head( '/' )
                .expect( 200 );
        } );

        it( 'should not overwrite the content-type', () => {
            const app = new Koa();

            app.use( ctx => {
                ctx.status = 200;
                ctx.type = 'application/javascript';
            } );

            return request( app.callback() )
                .head( '/' )
                .expect( 'content-type', /application\/javascript/ )
                .expect( 200 );
        } );
    } );

    describe( 'when no middleware is present', () => {
        it( 'should 404', () => {
            const app = new Koa();

            return request( app.callback() )
                .get( '/' )
                .expect( 404 );
        } );
    } );

    describe( 'when res has already been written to', () => {
        it( 'should not cause an app error', () => {
            const app = new Koa();

            app.use( ctx => {
                const res = ctx.res;
                ctx.status = 200;
                res.setHeader( 'Content-Type', 'text/html' );
                res.write( 'Hello' );
            } );

            app.on( 'error', err => { throw err } );

            return request( app.callback() )
                .get( '/' )
                .expect( 200 );
        } );

        it( 'should send the right body', () => {
            const app = new Koa();

            app.use( ctx => {
                const res = ctx.res;
                ctx.status = 200;
                res.setHeader( 'Content-Type', 'text/html' );
                res.write( 'Hello' );
                return new Promise( resolve => {
                    setTimeout( () => {
                        res.end( 'Goodbye' );
                        resolve();
                    }, 0 );
                } );
            } );

            return request( app.callback() )
                .get( '/' )
                .expect( 200 )
                .expect( 'HelloGoodbye' );
        } );
    } );

    describe( 'when .body is missing', () => {
        describe( 'with status=400', () => {
            it( 'should respond with the associated status message', () => {
                const app = new Koa();

                app.use( ctx => {
                    ctx.status = 400;
                } );

                return request( app.callback() )
                    .get( '/' )
                    .expect( 400 )
                    .expect( 'Content-Length', '11' )
                    .expect( 'Bad Request' );
            } );
        } );

        describe( 'with status=204', () => {
            it( 'should respond without a body', async() => {
                const app = new Koa();

                app.use( ctx => {
                    ctx.status = 204;
                } );

                const res = await request( app.callback() )
                    .get( '/' )
                    .expect( 204 )
                    .expect( '' );

                assert.equal( Object.prototype.hasOwnProperty.call( res.headers, 'content-type' ), false );
            } );
        } );

        describe( 'with status=205', () => {
            it( 'should respond without a body', async() => {
                const app = new Koa();

                app.use( ctx => {
                    ctx.status = 205;
                } );

                const res = await request( app.callback() )
                    .get( '/' )
                    .expect( 205 )
                    .expect( '' );

                assert.equal( Object.prototype.hasOwnProperty.call( res.headers, 'content-type' ), false );
            } );
        } );

        describe( 'with status=304', () => {
            it( 'should respond without a body', async() => {
                const app = new Koa();

                app.use( ctx => {
                    ctx.status = 304;
                } );

                const res = await request( app.callback() )
                    .get( '/' )
                    .expect( 304 )
                    .expect( '' );

                assert.equal( Object.prototype.hasOwnProperty.call( res.headers, 'content-type' ), false );
            } );
        } );

        describe( 'with custom status=700', () => {
            it( 'should respond with the associated status message', async() => {
                const app = new Koa();
                statuses.message[ '700' ] = 'custom status';

                app.use( ctx => {
                    ctx.status = 700;
                } );

                const res = await request( app.callback() )
                    .get( '/' )
                    .expect( 700 )
                    .expect( 'custom status' );

                assert.equal( ( res as any ).res.statusMessage, 'custom status' );
            } );
        } );

        describe( 'with custom statusMessage=ok', () => {
            it( 'should respond with the custom status message', async() => {
                const app = new Koa();

                app.use( ctx => {
                    ctx.status = 200;
                    ctx.message = 'okay';
                } );

                const res = await request( app.callback() )
                    .get( '/' )
                    .expect( 200 )
                    .expect( 'okay' );

                assert.equal( ( res as any ).res.statusMessage, 'okay' );
            } );
        } );

        describe( 'with custom status without message', () => {
            it( 'should respond with the status code number', () => {
                const app = new Koa();

                app.use( ctx => {
                    ctx.res.statusCode = 701;
                } );

                return request( app.callback() )
                    .get( '/' )
                    .expect( 701 )
                    .expect( '701' );
            } );
        } );
    } );

    describe( 'when .body is a null', () => {
        it( 'should respond 204 by default', async() => {
            const app = new Koa();

            app.use( ctx => {
                ctx.body = null;
            } );

            const res = await request( app.callback() )
                .get( '/' )
                .expect( 204 )
                .expect( '' );

            assert.equal( Object.prototype.hasOwnProperty.call( res.headers, 'content-type' ), false );
        } );

        it( 'should respond 204 with status=200', async() => {
            const app = new Koa();

            app.use( ctx => {
                ctx.status = 200;
                ctx.body = null;
            } );

            const res = await request( app.callback() )
                .get( '/' )
                .expect( 204 )
                .expect( '' );

            assert.equal( Object.prototype.hasOwnProperty.call( res.headers, 'content-type' ), false );
        } );

        it( 'should respond 205 with status=205', async() => {
            const app = new Koa();

            app.use( ctx => {
                ctx.status = 205;
                ctx.body = null;
            } );

            const res = await request( app.callback() )
                .get( '/' )
                .expect( 205 )
                .expect( '' );

            assert.equal( Object.prototype.hasOwnProperty.call( res.headers, 'content-type' ), false );
        } );

        it( 'should respond 304 with status=304', async() => {
            const app = new Koa();

            app.use( ctx => {
                ctx.status = 304;
                ctx.body = null;
            } );

            const res = await request( app.callback() )
                .get( '/' )
                .expect( 304 )
                .expect( '' );

            assert.equal( Object.prototype.hasOwnProperty.call( res.headers, 'content-type' ), false );
        } );
    } );

    describe( 'when .body is a string', () => {
        it( 'should respond', () => {
            const app = new Koa();

            app.use( ctx => {
                ctx.body = 'Hello';
            } );

            return request( app.callback() )
                .get( '/' )
                .expect( 'Hello' );
        } );
    } );

    describe( 'when .body is a Buffer', () => {
        it( 'should respond', () => {
            const app = new Koa();

            app.use( ctx => {
                ctx.body = Buffer.from( 'Hello' );
            } );

            return request( app.callback() )
                .get( '/' )
                .expect( 200 )
                .expect( Buffer.from( 'Hello' ) );
        } );
    } );

    describe( 'when .body is a Stream', () => {
        it( 'should respond', async() => {
            const app = new Koa();

            app.use( ctx => {
                ctx.body = fs.createReadStream( 'package.json' );
                ctx.set( 'Content-Type', 'application/json; charset=utf-8' );
            } );

            const res = await request( app.callback() )
                .get( '/' )
                .expect( 'Content-Type', 'application/json; charset=utf-8' );

            assert.equal( Object.prototype.hasOwnProperty.call( res.headers, 'content-length' ), false );
            assert.deepEqual( res.body, pkg );
        } );

        it( 'should strip content-length when overwriting', async() => {
            const app = new Koa();

            app.use( ctx => {
                ctx.body = 'hello';
                ctx.body = fs.createReadStream( 'package.json' );
                ctx.set( 'Content-Type', 'application/json; charset=utf-8' );
            } );

            const res = await request( app.callback() )
                .get( '/' )
                .expect( 'Content-Type', 'application/json; charset=utf-8' );

            assert.equal( Object.prototype.hasOwnProperty.call( res.headers, 'content-length' ), false );
            assert.deepEqual( res.body, pkg );
        } );

        it( 'should keep content-length if not overwritten', async() => {
            const app = new Koa();

            app.use( ctx => {
                ctx.length = fs.readFileSync( 'package.json' ).length;
                ctx.body = fs.createReadStream( 'package.json' );
                ctx.set( 'Content-Type', 'application/json; charset=utf-8' );
            } );

            const res = await request( app.callback() )
                .get( '/' )
                .expect( 'Content-Type', 'application/json; charset=utf-8' );

            assert.equal( Object.prototype.hasOwnProperty.call( res.headers, 'content-length' ), true );
            assert.deepEqual( res.body, pkg );
        } );

        it( 'should keep content-length if overwritten with the same stream',
            async() => {
                const app = new Koa();

                app.use( ctx => {
                    ctx.length = fs.readFileSync( 'package.json' ).length;
                    const stream = fs.createReadStream( 'package.json' );
                    ctx.body = stream;
                    ctx.body = stream;
                    ctx.set( 'Content-Type', 'application/json; charset=utf-8' );
                } );

                const res = await request( app.callback() )
                    .get( '/' )
                    .expect( 'Content-Type', 'application/json; charset=utf-8' );

                assert.equal( Object.prototype.hasOwnProperty.call( res.headers, 'content-length' ), true );
                assert.deepEqual( res.body, pkg );
            } );

        it( 'should handle errors', done => {
            const app = new Koa();

            app.use( ctx => {
                ctx.set( 'Content-Type', 'application/json; charset=utf-8' );
                ctx.body = fs.createReadStream( 'does not exist' );
            } );

            request( app.callback() )
                .get( '/' )
                .expect( 'Content-Type', 'text/plain; charset=utf-8' )
                .expect( 404 )
                .end( done );
        } );

        it( 'should handle errors when no content status', () => {
            const app = new Koa();

            app.use( ctx => {
                ctx.status = 204;
                ctx.body = fs.createReadStream( 'does not exist' );
            } );

            return request( app.callback() )
                .get( '/' )
                .expect( 204 );
        } );

        it( 'should handle all intermediate stream body errors', done => {
            const app = new Koa();

            app.use( ctx => {
                ctx.body = fs.createReadStream( 'does not exist' );
                ctx.body = fs.createReadStream( 'does not exist' );
                ctx.body = fs.createReadStream( 'does not exist' );
            } );

            request( app.callback() )
                .get( '/' )
                .expect( 404 )
                .end( done );
        } );
    } );

    describe( 'when .body is an Object', () => {
        it( 'should respond with json', () => {
            const app = new Koa();

            app.use( ctx => {
                ctx.body = { hello : 'world' };
            } );

            return request( app.callback() )
                .get( '/' )
                .expect( 'Content-Type', 'application/json; charset=utf-8' )
                .expect( '{"hello":"world"}' );
        } );
        describe( 'and headers sent', () => {
            it( 'should respond with json body and headers', () => {
                const app = new Koa();

                app.use( ctx => {
                    ctx.length = 17;
                    ctx.type = 'json';
                    ctx.set( 'foo', 'bar' );
                    ctx.res.flushHeaders();
                    ctx.body = { hello : 'world' };
                } );

                return request( app.callback() )
                    .get( '/' )
                    .expect( 'Content-Type', 'application/json; charset=utf-8' )
                    .expect( 'Content-Length', '17' )
                    .expect( 'foo', 'bar' )
                    .expect( '{"hello":"world"}' );
            } );
        } );
    } );

    describe( 'when an error occurs', () => {
        it( 'should emit "error" on the app', done => {
            const app = new Koa();

            app.use( () => {
                throw new Error( 'boom' );
            } );

            app.on( 'error', err => {
                assert.equal( err.message, 'boom' );
                done();
            } );

            request( app.callback() )
                .get( '/' )
                .end( () => {} );
        } );

        describe( 'with an .expose property', () => {
            it( 'should expose the message', () => {
                const app = new Koa();

                app.use( () => {
                    const err = new Error( 'sorry!' );
                    ( err as any ).status = 403;
                    ( err as any ).expose = true;
                    throw err;
                } );

                return request( app.callback() )
                    .get( '/' )
                    .expect( 403, 'sorry!' );
            } );
        } );

        describe( 'with a .status property', () => {
            it( 'should respond with .status', () => {
                const app = new Koa();

                app.use( () => {
                    const err = new Error( 's3 explodes' );
                    ( err as any ).status = 403;
                    throw err;
                } );

                return request( app.callback() )
                    .get( '/' )
                    .expect( 403, 'Forbidden' );
            } );
        } );

        it( 'should respond with 500', () => {
            const app = new Koa();

            app.use( () => {
                throw new Error( 'boom!' );
            } );

            return request( app.callback() )
                .get( '/' )
                .expect( 500, 'Internal Server Error' );
        } );

        it( 'should be catchable', () => {
            const app = new Koa();

            app.use( ( ctx, next ) => {
                return next().then( () => {
                    ctx.body = 'Hello';
                } ).catch( () => {
                    ctx.body = 'Got error';
                } );
            } );

            app.use( () => {
                throw new Error( 'boom!' );
            } );

            return request( app.callback() )
                .get( '/' )
                .expect( 200, 'Got error' );
        } );
    } );

    describe( 'when status and body property', () => {
        it( 'should 200', () => {
            const app = new Koa();

            app.use( ctx => {
                ctx.status = 304;
                ctx.body = 'hello';
                ctx.status = 200;
            } );

            return request( app.callback() )
                .get( '/' )
                .expect( 200 )
                .expect( 'hello' );
        } );

        it( 'should 204', async() => {
            const app = new Koa();

            app.use( ctx => {
                ctx.status = 200;
                ctx.body = 'hello';
                ctx.set( 'content-type', 'text/plain; charset=utf8' );
                ctx.status = 204;
            } );

            const res = await request( app.callback() )
                .get( '/' )
                .expect( 204 );

            assert.equal( Object.prototype.hasOwnProperty.call( res.headers, 'content-type' ), false );
        } );
    } );

    describe( 'with explicit null body', () => {
        it( 'should preserve given status', async() => {
            const app = new Koa();

            app.use( ctx => {
                ctx.body = null;
                ctx.status = 404;
            } );

            return request( app.callback() )
                .get( '/' )
                .expect( 404 )
                .expect( '' )
                .expect( {} );
        } );
        it( 'should respond with correct headers', async() => {
            const app = new Koa();

            app.use( ctx => {
                ctx.body = null;
                ctx.status = 401;
            } );

            const res = await request( app.callback() )
                .get( '/' )
                .expect( 401 )
                .expect( '' )
                .expect( {} );

            assert.equal( Object.prototype.hasOwnProperty.call( res.headers, 'content-type' ), false );
        } );
    } );
} );
