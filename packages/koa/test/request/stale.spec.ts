/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 * 
 * File: request/stale.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/05/2020
 * Description: 
 ******************************************************************/

import assert from 'assert';
import context from '../helpers/context';

describe( 'req.stale', () => {
    it( 'should be the inverse of req.fresh', () => {
        const ctx = context();
        ctx.status = 200;
        ctx.method = 'GET';
        ctx.req.headers[ 'if-none-match' ] = '"123"';
        ctx.set( 'ETag', '"123"' );
        assert.equal( ctx.fresh, true );
        assert.equal( ctx.stale, false );
    } );
} );
