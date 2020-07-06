/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: console/index.spec.js
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 07/07/2020
 * Description: 
 ******************************************************************/

const mockConsole = require( 'jest-mock-console' );
const C = require( '../../lib/constants' );
const Console = require( '../../lib/console' );

describe( 'Ynn.Console', () => {

    let restoreConsole;

    beforeEach( () => {
        restoreConsole = mockConsole( [ 'log', 'info', 'warn', 'error', 'debug', 'trace' ] );
    } );

    afterEach( () => restoreConsole() );

    it( 'debugging false', () => {
        const c = new Console( { debugging : false } ); 

        c.log( 1 );
        c.warn( 1 );
        c.error( 1 );
        c.info( 1 );
        c.debug( 1 );
        c.spec( 1 ); 
        c.trace( 1 );

        expect( console.log ).toHaveBeenCalledTimes( 0 );
        expect( console.warn ).toHaveBeenCalledTimes( 0 );
        expect( console.error ).toHaveBeenCalledTimes( 0 );
        expect( console.info ).toHaveBeenCalledTimes( 0 );
        expect( console.debug ).toHaveBeenCalledTimes( 0 );
        expect( console.trace ).toHaveBeenCalledTimes( 0 );
    } );

    it( 'none', () => {
        const c = new Console( { debugging : C.DEBUGGING_NONE } ); 

        c.log( 1 );
        c.warn( 1 );
        c.error( 1 );
        c.info( 1 );
        c.debug( 1 );
        c.spec( 1 ); 
        c.trace( 1 );

        expect( console.log ).toHaveBeenCalledTimes( 0 );
        expect( console.warn ).toHaveBeenCalledTimes( 0 );
        expect( console.error ).toHaveBeenCalledTimes( 0 );
        expect( console.info ).toHaveBeenCalledTimes( 0 );
        expect( console.debug ).toHaveBeenCalledTimes( 0 );
        expect( console.trace ).toHaveBeenCalledTimes( 0 );
    } );

    it( 'log', () => {
        const c = new Console( { debugging : C.DEBUGGING_LOG } ); 
        c.log( 1 );
        c.warn( 1 );
        c.error( 1 );
        c.info( 1 );
        c.debug( 1 );
        c.spec( 1 ); 
        c.trace( 1 );

        expect( console.log ).toHaveBeenCalledTimes( 1 );
        expect( console.warn ).toHaveBeenCalledTimes( 0 );
        expect( console.error ).toHaveBeenCalledTimes( 0 );
        expect( console.info ).toHaveBeenCalledTimes( 0 );
        expect( console.debug ).toHaveBeenCalledTimes( 0 );
        expect( console.trace ).toHaveBeenCalledTimes( 0 );
    } );

    it( 'warn', () => {
        const c = new Console( { debugging : C.DEBUGGING_WARN } ); 
        c.log( 1 );
        c.warn( 1 );
        c.error( 1 );
        c.info( 1 );
        c.debug( 1 );
        c.spec( 1 ); 
        c.trace( 1 );

        expect( console.log ).toHaveBeenCalledTimes( 0 );
        expect( console.warn ).toHaveBeenCalledTimes( 1 );
        expect( console.error ).toHaveBeenCalledTimes( 0 );
        expect( console.info ).toHaveBeenCalledTimes( 0 );
        expect( console.debug ).toHaveBeenCalledTimes( 0 );
        expect( console.trace ).toHaveBeenCalledTimes( 0 );
    } );

    it( 'error', () => {
        const c = new Console( { debugging : C.DEBUGGING_ERROR } ); 
        c.log( 1 );
        c.warn( 1 );
        c.error( 1 );
        c.info( 1 );
        c.debug( 1 );
        c.spec( 1 ); 
        c.trace( 1 );

        expect( console.log ).toHaveBeenCalledTimes( 0 );
        expect( console.warn ).toHaveBeenCalledTimes( 0 );
        expect( console.error ).toHaveBeenCalledTimes( 1 );
        expect( console.info ).toHaveBeenCalledTimes( 0 );
        expect( console.debug ).toHaveBeenCalledTimes( 0 );
        expect( console.trace ).toHaveBeenCalledTimes( 0 );
    } );

    it( 'info', () => {
        const c = new Console( { debugging : C.DEBUGGING_INFO } ); 
        c.log( 1 );
        c.warn( 1 );
        c.error( 1 );
        c.info( 1 );
        c.debug( 1 );
        c.spec( 1 ); 
        c.trace( 1 );

        expect( console.log ).toHaveBeenCalledTimes( 0 );
        expect( console.warn ).toHaveBeenCalledTimes( 0 );
        expect( console.error ).toHaveBeenCalledTimes( 0 );
        expect( console.info ).toHaveBeenCalledTimes( 1 );
        expect( console.debug ).toHaveBeenCalledTimes( 0 );
        expect( console.trace ).toHaveBeenCalledTimes( 0 );
    } );

    it( 'debug', () => {
        const c = new Console( { debugging : C.DEBUGGING_DEBUG } ); 
        c.log( 1 );
        c.warn( 1 );
        c.error( 1 );
        c.info( 1 );
        c.debug( 1 );
        c.spec( 1 ); 
        c.trace( 1 );

        expect( console.log ).toHaveBeenCalledTimes( 0 );
        expect( console.warn ).toHaveBeenCalledTimes( 0 );
        expect( console.error ).toHaveBeenCalledTimes( 0 );
        expect( console.info ).toHaveBeenCalledTimes( 0 );
        expect( console.debug ).toHaveBeenCalledTimes( 1 );
        expect( console.trace ).toHaveBeenCalledTimes( 0 );
    } );

    it( 'spec', () => {
        const c = new Console( { debugging : C.DEBUGGING_SPEC } ); 
        c.log( 1 );
        c.warn( 1 );
        c.error( 1 );
        c.info( 1 );
        c.debug( 1 );
        c.spec( 1 ); 
        c.trace( 1 );

        expect( console.log ).toHaveBeenCalledTimes( 1 );
        expect( console.warn ).toHaveBeenCalledTimes( 0 );
        expect( console.error ).toHaveBeenCalledTimes( 0 );
        expect( console.info ).toHaveBeenCalledTimes( 0 );
        expect( console.debug ).toHaveBeenCalledTimes( 0 );
        expect( console.trace ).toHaveBeenCalledTimes( 0 );
    } );

    it( 'spec', () => {
        const c = new Console( { debugging : C.DEBUGGING_TRACE } ); 
        c.log( 1 );
        c.warn( 1 );
        c.error( 1 );
        c.info( 1 );
        c.debug( 1 );
        c.spec( 1 ); 
        c.trace( 1 );

        expect( console.log ).toHaveBeenCalledTimes( 0 );
        expect( console.warn ).toHaveBeenCalledTimes( 0 );
        expect( console.error ).toHaveBeenCalledTimes( 0 );
        expect( console.info ).toHaveBeenCalledTimes( 0 );
        expect( console.debug ).toHaveBeenCalledTimes( 0 );
        expect( console.trace ).toHaveBeenCalledTimes( 1 );
    } );


    it( 'all', () => {
        const c = new Console( { debugging : C.DEBUGGING_ALL } ); 
        c.log( 1 );
        c.warn( 1 );
        c.error( 1 );
        c.info( 1 );
        c.debug( 1 );
        c.spec( 1 ); 
        c.trace( 1 );

        expect( console.log ).toHaveBeenCalledTimes( 2 );
        expect( console.warn ).toHaveBeenCalledTimes( 1 );
        expect( console.error ).toHaveBeenCalledTimes( 1 );
        expect( console.info ).toHaveBeenCalledTimes( 1 );
        expect( console.debug ).toHaveBeenCalledTimes( 1 );
        expect( console.trace ).toHaveBeenCalledTimes( 1 );
    } );

    it( 'default', () => {
        const c = new Console( { debugging : C.DEBUGGING_DEFAULT } ); 
        c.log( 1 );
        c.warn( 1 );
        c.error( 1 );
        c.info( 1 );
        c.debug( 1 );
        c.spec( 1 ); 
        c.trace( 1 );

        expect( console.log ).toHaveBeenCalledTimes( 1 );
        expect( console.warn ).toHaveBeenCalledTimes( 1 );
        expect( console.error ).toHaveBeenCalledTimes( 1 );
        expect( console.info ).toHaveBeenCalledTimes( 0 );
        expect( console.debug ).toHaveBeenCalledTimes( 0 );
        expect( console.trace ).toHaveBeenCalledTimes( 0 );
    } );
} );

describe( 'controller', () => {
    
} );
