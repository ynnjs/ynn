/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 * 
 * File: request/type.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/05/2020
 * Description: 
 ******************************************************************/

import assert from 'assert';
import { request } from '../helpers/context';

describe( 'req.type', () => {
    it( 'should return type void of parameters', () => {
        const req = request();
        req.header[ 'content-type' ] = 'text/html; charset=utf-8';
        assert.equal( req.type, 'text/html' );
    } );

    it( 'should return empty string with no host present', () => {
        const req = request();
        assert.equal( req.type, '' );
    } );
} );
