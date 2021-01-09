/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 *
 * File: request/search.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/05/2020
 * Description:
 ******************************************************************/

import assert from 'assert';
import context from '../helpers/context';

describe( 'ctx.search=', () => {
    it( 'should replace the search', () => {
        const ctx = context( { url : '/store/shoes' } );
        ctx.search = '?page=2&color=blue';
        assert.equal( ctx.url, '/store/shoes?page=2&color=blue' );
        assert.equal( ctx.search, '?page=2&color=blue' );
    } );

    it( 'should update ctx.querystring and ctx.query', () => {
        const ctx = context( { url : '/store/shoes' } );
        ctx.search = '?page=2&color=blue';
        assert.equal( ctx.url, '/store/shoes?page=2&color=blue' );
        assert.equal( ctx.querystring, 'page=2&color=blue' );
        assert.equal( ctx.query.page, '2' );
        assert.equal( ctx.query.color, 'blue' );
    } );

    it( 'should change .url but not .originalUrl', () => {
        const ctx = context( { url : '/store/shoes' } );
        ctx.search = '?page=2&color=blue';
        assert.equal( ctx.url, '/store/shoes?page=2&color=blue' );
        assert.equal( ctx.originalUrl, '/store/shoes' );
        assert.equal( ctx.request.originalUrl, '/store/shoes' );
    } );

    describe( 'when missing', () => {
        it( 'should return ""', () => {
            const ctx = context( { url : '/store/shoes' } );
            assert.equal( ctx.search, '' );
        } );
    } );
} );
