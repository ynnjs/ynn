/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 *
 * File: request/origin.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/05/2020
 * Description:
 ******************************************************************/

import assert from 'assert';
import Stream from 'stream';
import context from '../helpers/context';

describe( 'ctx.origin', () => {
    it( 'should return the origin of url', () => {
        const socket = new Stream.Duplex();
        const req = {
            url : '/users/1?next=/dashboard',
            headers : {
                host : 'localhost'
            },
            socket : socket,
            __proto__ : Stream.Readable.prototype
        };
        const ctx = context( req );
        assert.equal( ctx.origin, 'http://localhost' );
        // change it also work
        ctx.url = '/foo/users/1?next=/dashboard';
        assert.equal( ctx.origin, 'http://localhost' );
    } );
} );
