/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 * 
 * File: request/idempotent.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/05/2020
 * Description: 
 ******************************************************************/

import assert from 'assert';
import { request } from '../helpers/context';

describe( 'ctx.idempotent', () => {
    describe( 'when the request method is idempotent', () => {
        it( 'should return true', () => {
            [ 'GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'TRACE' ].forEach( method => {
                const req = request();
                req.method = method;
                assert.equal( req.idempotent, true );
            } );
        } );
    } );

    describe( 'when the request method is not idempotent', () => {
        it( 'should return false', () => {
            const req = request();
            req.method = 'POST';
            assert.equal( req.idempotent, false );
        } );
    } );
} );
