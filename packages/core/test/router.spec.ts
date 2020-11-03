/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: test/router.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/02/2020
 * Description: 
 ******************************************************************/

import Koa, { compose } from '@ynn/koa';
import Router from '../src/router';
import { createContext, Req } from './helpers/koa';

describe( 'Router', () => {
    
    describe( 'Router.match', () => {
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

    } );
} );
