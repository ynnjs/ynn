/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 * 
 * File: request/path.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/05/2020
 * Description: 
 ******************************************************************/

import assert from 'assert';
import parseurl from 'parseurl';
import context from '../helpers/context';

describe( 'ctx.path', () => {
    it( 'should return the pathname', () => {
        const ctx = context();
        ctx.url = '/login?next=/dashboard';
        assert.equal( ctx.path, '/login' );
    } );
} );

describe( 'ctx.path=', () => {
    it( 'should set the pathname', () => {
        const ctx = context();
        ctx.url = '/login?next=/dashboard';

        ctx.path = '/logout';
        assert.equal( ctx.path, '/logout' );
        assert.equal( ctx.url, '/logout?next=/dashboard' );
    } );

    it( 'should change .url but not .originalUrl', () => {
        const ctx = context( { url: '/login' } );
        ctx.path = '/logout';
        assert.equal( ctx.url, '/logout' );
        assert.equal( ctx.originalUrl, '/login' );
        assert.equal( ctx.request.originalUrl, '/login' );
    } );

    it( 'should not affect parseurl', () => {
        const ctx = context( { url: '/login?foo=bar' } );
        ctx.path = '/login';
        const url = parseurl( ctx.req );
        assert.equal( url.path, '/login?foo=bar' );
    } );
} );
