/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: test/router.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/27/2021
 * Description:
 ******************************************************************/

import { Router, Matches } from '../src/router';
import { createContext } from './helpers';

describe( 'Router', () => {
    it( 'methods and properties', () => {
        const router = new Router();
        expect( router ).toHaveProperty( 'get' );
        expect( router ).toHaveProperty( 'post' );
        expect( router ).toHaveProperty( 'put' );
        expect( router ).toHaveProperty( 'head' );
        expect( router ).toHaveProperty( 'patch' );
        expect( router ).toHaveProperty( 'delete' );
        expect( router ).toHaveProperty( 'options' );
        expect( router ).toHaveProperty( 'any' );
        expect( router ).toHaveProperty( 'match' );
        expect( router ).toHaveProperty( 'match' );
        expect( router ).toHaveProperty( 'rules' );
    } );

    for( const method of [ 'GET', 'POST', 'PUT', 'HEAD', 'PATCH', 'DELETE', 'OPTIONS' ] ) {
        describe( method, () => {

            it( 'should have returned correct value with correct properties', () => {
                const router = new Router();
                const pattern = '/';
                router[ method.toLowerCase() ]( pattern, 'a.b' );
                const matches = router.match( createContext( {
                    method,
                    url : '/'
                } ) ) as Matches;

                expect( matches.params ).toEqual( {} );
                expect( matches.matches ).toEqual( [] );
                expect( matches.rule ).toEqual( [ method, '/', 'a.b' ] );
            } );

            it( 'should support using regexp', () => {
                const router = new Router();
                const pattern = /\//;
                router[ method.toLowerCase() ]( pattern, 'a.b' );
                const matches = router.match( createContext( {
                    method,
                    url : '/'
                } ) ) as Matches;

                expect( matches.params ).toEqual( {} );
                expect( matches.matches ).toEqual( [] );
                expect( matches.rule ).toEqual( [ method, pattern, 'a.b' ] );
            } );

            it( 'should support given multiple patterns', () => {
                const router = new Router();
                const args = [ [ '/x', '/y' ], 'a.b' ];
                router[ method.toLowerCase() ]( ...args );
                const matches = router.match( createContext( {
                    method,
                    url : '/x'
                } ) ) as Matches;

                expect( matches.params ).toEqual( {} );
                expect( matches.matches ).toEqual( [] );
                expect( matches.rule ).toEqual( [ method, ...args ] );
            } );

            it( 'should return correct matches while using string pattern', () => {
                const router = new Router();
                const args = [ '/:id', 'a.b' ];
                router[ method.toLowerCase() ]( ...args );
                const matches = router.match( createContext( {
                    method,
                    url : '/abc'
                } ) ) as Matches;

                expect( matches.params ).toEqual( { id : 'abc' } );
                expect( matches.matches ).toEqual( [ 'abc' ] );
                expect( matches.rule ).toEqual( [ method, ...args ] );
            } );

            it( 'should return correct matches while using regexp pattern', () => {
                const router = new Router();
                const args = [ /^\/w(\d+)/, 'a.b' ];
                router[ method.toLowerCase() ]( ...args );
                const matches = router.match( createContext( {
                    method,
                    url : '/w1234'
                } ) ) as Matches;

                expect( matches.params ).toEqual( { '0' : '1234' } );
                expect( matches.matches ).toEqual( [ '1234' ] );
                expect( matches.rule ).toEqual( [ method, ...args ] );
            } );

            it( 'should return correct matches while using captured groups regexp pattern', () => {
                const router = new Router();
                const args = [ /^\/w(?<id>\d+)/, 'a.b' ];
                router[ method.toLowerCase() ]( ...args );
                const matches = router.match( createContext( {
                    method,
                    url : '/w1234'
                } ) ) as Matches;

                expect( matches.params ).toEqual( { id : '1234' } );
                expect( matches.matches ).toEqual( [ '1234' ] );
                expect( matches.rule ).toEqual( [ method, ...args ] );
            } );

            it( 'should return false if nothing matched', () => {
                const router = new Router();
                const args = [ [ '/x', '/y' ], 'a.b' ];
                router[ method.toLowerCase() ]( ...args );
                const matches = router.match( createContext( {
                    method,
                    url : '/z'
                } ) ) as Matches;

                expect( matches ).toEqual( false );
            } );
        } );
    }
} );
