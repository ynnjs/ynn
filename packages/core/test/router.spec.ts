/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: test/router.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/02/2020
 * Description: 
 ******************************************************************/

import Router from '../src/router';
import Koa, { createContext, Req, Res } from './helpers/koa';

describe( 'Router', () => {

    describe( 'Router.get', () => {
        it( 'should execute the callback function as a middleware of Koa', done => {
            const app = new Koa();
            const router = new Router( app );
            const req = new Req( { url : '/a', method : 'GET' } );

            router.get( '/a', ( ctx ) => {
                expect( ctx.path ).toEqual( '/a' );
                done();
            } );

            app.$( { req } );
        } );

        it( 'should compose the list of middleware', done => {
            
            const app = new Koa();
            const router = new Router( app );
            const req = new Req( { url : '/a', method : 'GET' } );

            router.get( '/a', [
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
            const req = new Req( { url : '/a', method : 'GET' } );

            const fn1 = jest.fn();

            router.get( '/a', ( ctx, next ) => {
                expect( ctx.path ).toEqual( '/a' );
                fn1();
                return next();
            } );

            router.get( /^\/\w+/, ctx => {
                expect( ctx.path ).toEqual( '/a' );
                expect( fn1 ).toHaveBeenCalledTimes( 1 );
                done();
            } );

            app.$( { req } );
        } );

        it( 'should not match request with unmatched path', done => {
            
            const app = new Koa();
            const router = new Router( app );
            const req = new Req( { url : '/b', method : 'GET' } );

            const fn1 = jest.fn();

            router.get( '/a', ( ctx, next ) => {
                fn1();
                return next();
            } );

            router.get( '/b', () => {
                expect( fn1 ).not.toHaveBeenCalled();
                done();
            } );

            app.$( { req } )
        } );

        it( 'should have added routerMatches to ctx', () => {
            
        } );
    } );
    
    describe( 'static method Router.match', () => {
        it( 'should match a string', () => {
            const req = new Req( { url : '/a' } );
            const ctx = createContext( { req } );
            ctx.params = {};
            expect( Router.match( '/a', ctx ) ).toBeTruthy();
        } ); 

        it( 'should match a RegExp', () => {
            const req = new Req( { url : '/a/123' } );
            const ctx = createContext( { req } );
            ctx.params = {};
            expect( Router.match( /^\/a\/\d+/, ctx ) ).toBeTruthy();
        } );

        it( 'should not mismatch', () => {
            const req = new Req( { url : '/b/123' } );
            const ctx = createContext( { req } );
            ctx.params = {};
            expect( Router.match( /^\/a\/\d+/, ctx ) ).toBeFalsy();
        } );

        it( 'should support array of strings', () => {
            const req = new Req( { url : '/a' } );
            const ctx = createContext( { req } );
            ctx.params = {};
            expect( Router.match( [ '/b', '/a' ], ctx ) ).toBeTruthy();
        } );

        it( 'should support array of Regexp', () => {
            const req = new Req( { url : '/a/123' } );
            const ctx = createContext( { req } );
            ctx.params = {};
            expect( Router.match( [ /^\/b\/\d+/, /^\/a\/\d+/ ], ctx ) ).toBeTruthy();
        } );

        it( 'should support array of mixed values', () => {
            const req = new Req( { url : '/a/123' } );
            const ctx = createContext( { req } );
            ctx.params = {};
            expect( Router.match( [ /^\/b\/\d+/, '/a/:id' ], ctx ) ).toBeTruthy();
        } );

        xit( 'should create params property in ctx even though false is returned', () => {
            const ctx = createContext();
            Router.match( '/a/:id', ctx );
            expect( ctx ).toHaveProperty( 'params', {} );
        } );

        it( 'should fill ctx.params with items matched in string', () => {
            const req = new Req( { url : '/a/123' } );
            const ctx = createContext( { req } );
            ctx.params = {};
            Router.match( '/a/:id', ctx );
            expect( ctx ).toHaveProperty( 'params', {
                id : '123'
            } );
        } );

        it( 'should fill ctx.params in capturing groups', () => {
            const req = new Req( { url : '/a/123' } );
            const ctx = createContext( { req } );
            ctx.params = {};
            Router.match( /^\/a\/(?<id>\d+)/, ctx );
            expect( ctx ).toHaveProperty( 'params', { id : '123' } );
        } );

        it( 'should get correct params in complex situation', () => {
            const req = new Req( { url : 'http://www.google.com/user/123456' } );
            const ctx = createContext( { req } );
            ctx.params = {};
            Router.match( [ /^\/a\/(?<id>\d+)/, '/user/:id' ], ctx );
            expect( ctx ).toHaveProperty( 'params', { id: '123456' } );
        } );

        it( 'should return the matching results', () => {
            const req = new Req( { url : '/a/123' } );
            const ctx = createContext( { req } );
            ctx.params = {};
            const matches = Router.match( /^\/a\/(?<id>\d+)/, ctx );
            expect( Array.isArray( matches ) ).toBeTruthy();
            expect( matches[ 0 ] ).toEqual( '/a/123' );  
            expect( matches[ 1 ] ).toEqual( '123' );  
            expect( matches ).toHaveProperty( 'index', 0 );  
            expect( matches ).toHaveProperty( 'groups', { id : '123' } );  
        } );
    } );
} );
