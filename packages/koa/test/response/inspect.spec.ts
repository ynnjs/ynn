/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 *
 * File: response/inspect.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/06/2020
 * Description:
 ******************************************************************/

import util from 'util';
import assert from 'assert';
import { response } from '../helpers/context';

describe( 'res.inspect()', () => {
    describe( 'with no response.res present', () => {
        it( 'should return null', () => {
            const res = response();
            res.body = 'hello';
            delete res.res;
            assert.equal( res.inspect(), null );
            assert.equal( util.inspect( res ), 'undefined' );
        } );
    } );

    it( 'should return a json representation', () => {
        const res = response();
        res.body = 'hello';

        const expected = {
            status : 200,
            message : 'OK',
            headers : {
                'content-type' : 'text/plain; charset=utf-8',
                'content-length' : '5'
            },
            body : 'hello'
        };

        assert.deepEqual( res.inspect(), expected );
        assert.deepEqual( util.inspect( res ), util.inspect( expected ) );
    } );
} );
