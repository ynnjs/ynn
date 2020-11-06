/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: test/router.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/02/2020
 * Description: 
 ******************************************************************/

import 'jest-extended';
import Router from '../src/router';
import Koa, { Req } from './helpers/koa';

const methods = [ 'GET', 'POST', 'HEAD', 'DELETE', 'PATCH', 'OPTIONS' ];

describe( 'Router', () => {

    for( const method of methods ) {

        const m = method.toLowerCase();
        
        describe( `Router.${m}`, () => {

            it( 'should execute the callback function as a middleware of Koa', done => {
                const app = new Koa();
                const router = new Router( app );
                const req = new Req( { url : '/a', method } );

                router[ m ]( '/a', ctx => {
                    expect( ctx.path ).toEqual( '/a' );
                    done();
                } );

                app.$( { req } );
            } );

            it( 'should compose the list of middleware', done => {
                
                const app = new Koa();
                const router = new Router( app );
                const req = new Req( { url : '/a', method } );

                router[ m ]( '/a', [
                    ( ctx, next ) => {
                        expect( ctx.path ).toEqual( '/a' );
                        return next();
                    },
                    ( ctx ) => {
                        expect( ctx.path ).toEqual( '/a' );
                        done();
                    }
                ] );

                app.$( { req } );
            } );

            it( 'should try matching rest rules if next method was called in the previous middleware', done => {
                
                const app = new Koa();
                const router = new Router( app );
                const req = new Req( { url : '/a', method } );

                const fn1 = jest.fn();

                router[ m ]( '/a', ( ctx, next ) => {
                    expect( ctx.path ).toEqual( '/a' );
                    fn1();
                    return next();
                } );

                router[ m ]( /^\/\w+/, ctx => {
                    expect( ctx.path ).toEqual( '/a' );
                    expect( fn1 ).toHaveBeenCalledTimes( 1 );
                    done();
                } );

                app.$( { req } );
            } );

            it( 'should not match request with unmatched path', done => {
                
                const app = new Koa();
                const router = new Router( app );
                const req = new Req( { url : '/b', method } );

                const fn1 = jest.fn();

                router[ m ]( '/a', ( ctx, next ) => {
                    fn1();
                    return next();
                } );

                router[ m ]( '/b', () => {
                    expect( fn1 ).not.toHaveBeenCalled();
                    done();
                } );

                app.$( { req } )
            } );

            it( 'should have defined params property to ctx', done => {
                const app = new Koa();
                const router = new Router( app );
                const req = new Req( { url : '/user/123456?fr=se', method } );

                router[ m ]( '/user/:id', ctx => {
                    expect( ctx ).toHaveProperty( 'params', { id : '123456' } );
                    done();
                } )

                app.$( { req } );
            } );

            it( 'should have added routerMatches to ctx', done => {
                const app = new Koa();
                const router = new Router( app );
                const req = new Req( { url : '/user/123456?fr=se', method } );

                router[ m ]( '/user/:id', ctx => {
                    expect( ctx.routerMatches.slice( 0, 2 ) ).toEqual( [ '123456' ] );
                    done();
                } )

                app.$( { req } );
            } );

            for( const item of methods ) {

                if( item === method ) continue;
                
                it( 'should not matche request with other methods', done => {
                    
                    const app = new Koa();
                    const router = new Router( app );
                    const req = new Req( { url : '/user/123456', method : item } );

                    const fn = jest.fn();

                    router[ method.toLowerCase() ]( '/user/:id', ( ctx, next ) => {
                        fn();
                        return next();
                    } )

                    app.use( () => {
                        expect( fn ).not.toHaveBeenCalled();
                        done();
                    } );

                    app.$( { req } );
                } );
            }
        } );
    }

    describe( 'Router.any', () => {

        for( const method of methods ) {
            it( `should match ${method} requests`, done => {
                const app = new Koa();
                const router = new Router( app );
                const req = new Req( { url : '/a', method } );

                router.any( '*', '/a', ctx => {
                    expect( ctx.path ).toEqual( '/a' );
                    done();
                } );

                app.$( { req } );
            } );
        }

        it( 'should support to give a string as methods list', done => {
            
            const app = new Koa();
            const router = new Router( app );
            const req = new Req( { url : '/a', method : 'POST' } );

            router.any( 'post', '/a', ctx => {
                expect( ctx.path ).toEqual( '/a' );
                done();
            } );

            app.$( { req } );
        } );

        it( 'should match request of types in the given list', done => {
            const app = new Koa();
            const router = new Router( app );
            const req = new Req( { url : '/a', method : 'POST' } );

            router.any( [ 'GET', 'POST' ], '/a', ctx => {
                expect( ctx.path ).toEqual( '/a' );
                done();
            } );

            app.$( { req } );
        } );

        it( 'should support using lowercase letters in method list', done => {
            const app = new Koa();
            const router = new Router( app );
            const req = new Req( { url : '/a', method : 'GET' } );

            router.any( [ 'get', 'post' ], '/a', ctx => {
                expect( ctx.path ).toEqual( '/a' );
                done();
            } );

            app.$( { req } );
        } );

        it( 'should have composed all items as middlewares if the callback function is an array', done => {
            const app = new Koa();
            const router = new Router( app );
            const req = new Req( { url : '/a', method : 'GET' } );

            router.any( '*', '/a', [
                ( ctx, next ) => {
                    expect( ctx.path ).toEqual( '/a' );
                    return next();
                },
                ( ctx ) => {
                    expect( ctx.path ).toEqual( '/a' );
                    done();
                }
            ] );

            app.$( { req } );
        } );
    } );
    
    describe( 'static method Router.match', () => {
        it( 'should match a string', () => {
            expect( Router.match( '/a', '/a' ) ).toBeTruthy();
        } ); 

        it( 'should match a RegExp', () => {
            expect( Router.match( /^\/a\/\d+/, '/a/123' ) ).toBeTruthy();
        } );

        it( 'should not mismatch', () => {
            expect( Router.match( /^\/a\/\d+/, '/b/123' ) ).toBeFalsy();
        } );

        it( 'should support array of strings', () => {
            expect( Router.match( [ '/b', '/a' ], '/a' ) ).toBeTruthy();
        } );

        it( 'should support array of Regexp', () => {
            expect( Router.match( [ /^\/b\/\d+/, /^\/a\/\d+/ ], '/a/123' ) ).toBeTruthy();
        } );

        it( 'should support array of mixed values', () => {
            expect( Router.match( [ /^\/b\/\d+/, '/a/:id' ], '/a/123' ) ).toBeTruthy();
        } );

        it( 'should fill ctx.params with items matched in string', () => {
            const res = Router.match( '/a/:id', '/a/123' );
            expect( res ).toHaveProperty( 'params', { id : '123' } );
            expect( ( res as any ).matches.slice( 0, 2 ) ).toEqual( [ '/a/123', '123' ] );
        } );

        it( 'should return correct result with capturing groups', () => {
            const res = Router.match( /^\/a\/(?<id>\d+)/, '/a/123' );
            expect( res ).toHaveProperty( 'params', { id : '123' } );
            expect( ( res as any ).matches.slice( 0, 2 ) ).toEqual( [ '/a/123', '123' ] );
        } );

        it( 'should return correct result in complex situation', () => {
            const res = Router.match( [ /^\/a\/(?<id>\d+)/, '/x/:name', '/user/:id' ], '/user/123456' );
            const { matches, params } = res as any;
            expect( params ).toHaveProperty( 'id', '123456' );
            expect( matches[ 3 ] ).toEqual( '123456' );
        } );

        it( 'should return the matching results', () => {
            const res = Router.match( /^\/a\/(?<id>\d+)/, '/a/123' );
            const { matches, params } = res as any;
            expect( matches ).toBeArray();
            expect( matches ).toBeArrayOfSize( 2 );
            expect( matches[ 0 ] ).toEqual( '/a/123' );  
            expect( matches[ 1 ] ).toEqual( '123' );  
            expect( matches ).toHaveProperty( 'index', 0 );  
            expect( matches ).toHaveProperty( 'groups', { id : '123' } );  
            expect( params ).toEqual( { id : '123' } );
        } );
    } );
} );
