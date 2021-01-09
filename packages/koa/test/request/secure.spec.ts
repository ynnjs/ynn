/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 *
 * File: request/secure.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/05/2020
 * Description:
 ******************************************************************/

import assert from 'assert';
import { request } from '../helpers/context';

describe( 'req.secure', () => {
    it( 'should return true when encrypted', () => {
        const req = request();
        req.req.socket = { encrypted : true };
        assert.equal( req.secure, true );
    } );
} );
