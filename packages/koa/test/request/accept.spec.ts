/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 * 
 * File: request/accept.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/05/2020
 * Description: 
 ******************************************************************/

import assert from 'assert';
import Accept from 'accepts';
import context from '../helpers/context';

describe( 'ctx.accept', () => {
    it( 'should return an Accept instance', () => {
        const ctx = context();
        ctx.req.headers.accept = 'application/*;q=0.2, image/jpeg;q=0.8, text/html, text/plain';
        assert( ctx.accept instanceof Accept );
    } );
} );

describe( 'ctx.accept=', () => {
    it( 'should replace the accept object', () => {
        const ctx = context();
        ctx.req.headers.accept = 'text/plain';
        assert.deepEqual( ctx.accepts(), [ 'text/plain' ] );

        const request = context.request();
        request.req.headers.accept = 'application/*;q=0.2, image/jpeg;q=0.8, text/html, text/plain';
        ctx.accept = Accept( request.req );
        assert.deepEqual( ctx.accepts(), [ 'text/html', 'text/plain', 'image/jpeg', 'application/*' ] );
    } );
} );
