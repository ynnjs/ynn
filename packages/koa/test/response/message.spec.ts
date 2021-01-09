/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 *
 * File: response/message.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/06/2020
 * Description:
 ******************************************************************/

import assert from 'assert';
import { response } from '../helpers/context';

describe( 'res.message', () => {
    it( 'should return the response status message', () => {
        const res = response();
        res.status = 200;
        assert.equal( res.message, 'OK' );
    } );

    describe( 'when res.message not present', () => {
        it( 'should look up in statuses', () => {
            const res = response();
            res.res.statusCode = 200;
            assert.equal( res.message, 'OK' );
        } );
    } );
} );

describe( 'res.message=', () => {
    it( 'should set response status message', () => {
        const res = response();
        res.status = 200;
        res.message = 'ok';
        assert.equal( res.res.statusMessage, 'ok' );
        assert.equal( res.inspect().message, 'ok' );
    } );
} );
