/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 *
 * File: request/inspect.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/05/2020
 * Description:
 ******************************************************************/

import util from 'util';
import assert from 'assert';
import { request } from '../helpers/context';

describe( 'req.inspect()', () => {
    describe( 'with no request.req present', () => {
        it( 'should return null', () => {
            const req = request();
            req.method = 'GET';
            delete req.req;
            assert( undefined === req.inspect() );
            assert( util.inspect( req ) === 'undefined' );
        } );
    } );

    it( 'should return a json representation', () => {
        const req = request();
        req.method = 'GET';
        req.url = 'example.com';
        req.header.host = 'example.com';

        const expected = {
            method : 'GET',
            url : 'example.com',
            headers : {
                host : 'example.com'
            }
        };

        assert.deepEqual( req.inspect(), expected );
        assert.deepEqual( util.inspect( req ), util.inspect( expected ) );
    } );
} );
