/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 *
 * File: request/length.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/05/2020
 * Description:
 ******************************************************************/

import assert from 'assert';
import { request } from '../helpers/context';

describe( 'ctx.length', () => {
    it( 'should return length in content-length', () => {
        const req = request();
        req.header[ 'content-length' ] = '10';
        assert.equal( req.length, 10 );
    } );

    it( 'should return undefined with no content-length present', () => {
        const req = request();
        assert.equal( req.length, undefined );
    } );
} );
