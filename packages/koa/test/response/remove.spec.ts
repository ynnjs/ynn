/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 * 
 * File: response/remove.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/06/2020
 * Description: 
 ******************************************************************/

import assert from 'assert';
import context from '../helpers/context';

describe( 'ctx.remove( name )', () => {
    it( 'should remove a field', () => {
        const ctx = context();
        ctx.set( 'x-foo', 'bar' );
        ctx.remove( 'x-foo' );
        assert.deepEqual( ctx.response.header, {} );
    } );
} );
