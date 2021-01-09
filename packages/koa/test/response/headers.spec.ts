/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 *
 * File: response/headers.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/06/2020
 * Description:
 ******************************************************************/

import assert from 'assert';
import { response } from '../helpers/context';

describe( 'res.header', () => {
    it( 'should return the response header object', () => {
        const res = response();
        res.set( 'X-Foo', 'bar' );
        assert.deepEqual( res.headers, { 'x-foo' : 'bar' } );
    } );

    describe( 'when res._headers not present', () => {
        it( 'should return empty object', () => {
            const res = response();
            res.res._headers = null;
            assert.deepEqual( res.headers, {} );
        } );
    } );
} );
