/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File：extension.spec.js
 * Author ：LvChengbin<lvchengbin59@gmail.com>
 * Time ：02/13/2020
 * Description ：
 ******************************************************************/

const is = require( '@lvchengbin/is' );
const Extension = require( '../../lib/extension' );
const app = require( './app' );

describe( 'Ynn Extensions', () => {

    afterAll( () => app.ready() ); 

    it( 'class', () => {
        expect( is.class( app.E1 ) ).toBeTruthy(); 
        expect( app.E1.prototype instanceof Extension ).toBeTruthy();
    } )

    it( 'function', () => {
        expect( is.class( app.E2 ) ).toBeTruthy(); 
        expect( app.E2.prototype instanceof Extension ).toBeTruthy();
    } );

    it( 'path', () => {
        expect( app.$e3 ).toEqual( 'abc' ); 
    } );

    it( 'options', () => {
        expect( app.$e4 ).toEqual( 'abc' ); 
    } );

    it( 'name', () => {
        expect( app.E5 ).toEqual( 'abc' );        
    } );

    it( 'class in an extra file', () => {
        expect( app.E6.prototype instanceof Extension ).toBeTruthy(); 
    } );
} );
