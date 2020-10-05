/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 * 
 * File: request/charset.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/05/2020
 * Description: 
 ******************************************************************/


import assert from 'assert';
import context from '../helpers/context';

describe( 'req.charset', () => {
    describe( 'with no content-type present', () => {
        it( 'should return ""', () => {
            const req = context.request();
            assert( '' === req.charset );
        } );
    } );

    describe( 'with charset present', () => {
        it( 'should return ""', () => {
            const req = context.request();
            req.headers[ 'content-type' ] = 'text/plain';
            assert( '' === req.charset );
        } );
    } );

    describe( 'with a charset', () => {
        it( 'should return the charset', () => {
            const req = context.request();
            req.headers[ 'content-type' ] = 'text/plain; charset=utf-8';
            assert.equal( req.charset, 'utf-8' );
        } );

        it( 'should return "" if content-type is invalid', () => {
            const req = context.request();
            req.headers[ 'content-type' ] = 'application/json; application/text; charset=utf-8';
            assert.equal( req.charset, '' );
        } );
    } );
} );
