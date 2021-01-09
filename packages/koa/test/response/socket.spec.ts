/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 *
 * File: response/socket.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/06/2020
 * Description:
 ******************************************************************/

import assert from 'assert';
import Stream from 'stream';
import { response } from '../helpers/context';

describe( 'res.socket', () => {
    it( 'should return the request socket object', () => {
        const res = response();
        assert.equal( res.socket instanceof Stream, true );
    } );
} );
