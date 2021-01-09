/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 *
 * File: response/has.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/06/2020
 * Description:
 ******************************************************************/

import assert from 'assert';
import context from '../helpers/context';

describe( 'ctx.response.has( name )', () => {
    it( 'should check a field value, case insensitive way', () => {
        const ctx = context();
        ctx.set( 'X-Foo', '' );
        assert.ok( ctx.response.has( 'x-Foo' ) );
        assert.ok( ctx.has( 'x-foo' ) );
    } );

    it( 'should return false for non-existent header', () => {
        const ctx = context();
        assert.strictEqual( ctx.response.has( 'boo' ), false );
        ctx.set( 'x-foo', 5 );
        assert.strictEqual( ctx.has( 'x-boo' ), false );
    } );
} );
