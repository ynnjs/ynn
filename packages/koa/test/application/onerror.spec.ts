/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 * 
 * File: application/onerror.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/06/2020
 * Description: 
 ******************************************************************/

import vm from 'vm';
import assert from 'assert';
// import jest from 'jest';
import Koa from '../../src/application';

describe( 'app.onerror( err )', () => {

    it( 'should throw an error if a non-error is given', () => {
        const app = new Koa();

        assert.throws(() => {
            app.onerror( 'foo' );
        }, TypeError, 'non-error thrown: foo' );
    } );

    it( 'should accept errors coming from other scopes', () => {
        const ExternError = vm.runInNewContext( 'Error' );

        const app = new Koa();
        const error = Object.assign( new ExternError( 'boom' ), {
            status: 418,
            expose: true
        } );

        assert.doesNotThrow(() => app.onerror( error ));
    } );

    it( 'should do nothing if status is 404', () => {
        const app = new Koa();
        const err = new Error();

        err.status = 404;

        const spy = jest.spyOn( console, 'error' ).mockImplementation();
        app.onerror( err );
        expect( spy ).toHaveBeenCalled();
        spy.mockRestore();
    } );

    it( 'should do nothing if .silent', () => {
        const app = new Koa();
        app.silent = true;
        const err = new Error();

        const spy = jest.spyOn( console, 'error' ).mockImplementation();
        app.onerror( err );
        expect( spy ).toHaveBeenCalled();
        spy.mockRestore();
    } );

    it( 'should log the error to stderr', () => {
        const app = new Koa();
        app.env = 'dev';

        const err = new Error();
        err.stack = 'Foo';

        const spy = jest.spyOn( console, 'error' ).mockImplementation();
        app.onerror( err );
        expect( spy ).toHaveBeenCalledWith( '\n  Foo\n' );
        spy.mockRestore();
    } );

    it( 'should use err.toString() instead of err.stack', () => {
        const app = new Koa();
        app.env = 'dev';

        const err = new Error( 'mock stack null' );
        err.stack = null;

        app.onerror( err );

        let msg = '';
        mm( console, 'error', input => {
            if ( input ) msg = input;
        } );
        app.onerror( err );
        assert( msg === '\n  Error: mock stack null\n' );
    } );
} );
