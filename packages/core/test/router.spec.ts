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
        it( '', () => {
            const app = new Koa();
            const router = new Router( app );
            const req = new Req( { url : '/a', method : 'GET' } );

            router.get( '/a', ( ctx, next ) => {
                console.log( '```````````````````````````' );
            } );

            app.callback()( req, new Res() );
        } );
    } );
    
    describe( 'static method Router.match', () => {
        it( 'should match a string', () => {
            const req = new Req( { url : '/a' } );
            const ctx = createContext( { req } );
            expect( Router.match( '/a', ctx ) ).toBeTruthy();
        } ); 

        it( 'should match a RegExp', () => {
            const req = new Req( { url : '/a/123' } );
            const ctx = createContext( { req } );
            expect( Router.match( /^\/a\/\d+/, ctx ) ).toBeTruthy();
        } );

        it( 'should not mismatch', () => {
            const req = new Req( { url : '/b/123' } );
            const ctx = createContext( { req } );
            expect( Router.match( /^\/a\/\d+/, ctx ) ).toBeFalsy();
        } );

        it( 'should support array of strings', () => {
            const req = new Req( { url : '/a' } );
            const ctx = createContext( { req } );
            expect( Router.match( [ '/b', '/a' ], ctx ) ).toBeTruthy();
        } );

        it( 'should support array of Regexp', () => {
            const req = new Req( { url : '/a/123' } );
            const ctx = createContext( { req } );
            expect( Router.match( [ /^\/b\/\d+/, /^\/a\/\d+/ ], ctx ) ).toBeTruthy();
        } );

        it( 'should support array of mixed values', () => {
            const req = new Req( { url : '/a/123' } );
            const ctx = createContext( { req } );
            expect( Router.match( [ /^\/b\/\d+/, '/a/:id' ], ctx ) ).toBeTruthy();
        } );

        it( 'should create params property in ctx even though false is returned', () => {
            const ctx = createContext();
            Router.match( '/a/:id', ctx );
            expect( ctx ).toHaveProperty( 'params', {} );
        } );

        it( 'should fill ctx.params with items matched in string', () => {
            const req = new Req( { url : '/a/123' } );
            const ctx = createContext( { req } );
            Router.match( '/a/:id', ctx );
            expect( ctx ).toHaveProperty( 'params', {
                id : '123'
            } );
        } );

        it( 'should fill ctx.params in capturing groups', () => {
            const req = new Req( { url : '/a/123' } );
            const ctx = createContext( { req } );
            Router.match( /^\/a\/(?<id>\d+)/, ctx );
            expect( ctx ).toHaveProperty( 'params', { id : '123' } );
        } );

        it( 'should get correct params in complex situation', () => {
            const req = new Req( { url : 'http://www.google.com/user/123456' } );
            const ctx = createContext( { req } );
            Router.match( [ /^\/a\/(?<id>\d+)/, '/user/:id' ], ctx );
            expect( ctx ).toHaveProperty( 'params', { id: '123456' } );
        } );

        it( 'should return the matching results', () => {
            const req = new Req( { url : '/a/123' } );
            const ctx = createContext( { req } );
            const matches = Router.match( /^\/a\/(?<id>\d+)/, ctx );
            expect( Array.isArray( matches ) ).toBeTruthy();
            expect( matches[ 0 ] ).toEqual( '/a/123' );  
            expect( matches[ 1 ] ).toEqual( '123' );  
            expect( matches ).toHaveProperty( 'index', 0 );  
            expect( matches ).toHaveProperty( 'groups', { id : '123' } );  
        } );
    } );
} );
