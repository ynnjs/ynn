/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 * 
 * File: request/get.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/05/2020
 * Description: 
 ******************************************************************/

import assert from 'assert';
import context from '../helpers/context';

describe( 'ctx.get( name )', () => {
    it( 'should return the field value', () => {
        const ctx = context();
        ctx.req.headers.host = 'http://google.com';
        ctx.req.headers.referer = 'http://google.com';
        assert.equal( ctx.get( 'HOST' ), 'http://google.com' );
        assert.equal( ctx.get( 'Host' ), 'http://google.com' );
        assert.equal( ctx.get( 'host' ), 'http://google.com' );
        assert.equal( ctx.get( 'referer' ), 'http://google.com' );
        assert.equal( ctx.get( 'referrer' ), 'http://google.com' );
    } );
} );
