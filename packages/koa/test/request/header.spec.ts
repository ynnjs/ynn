/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 *
 * File: request/header.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/05/2020
 * Description:
 ******************************************************************/

import assert from 'assert';
import context from '../helpers/context';

describe( 'req.header', () => {
    it( 'should return the request header object', () => {
        const req = context.request();
        assert.deepEqual( req.header, req.req.headers );
    } );

    it( 'should set the request header object', () => {
        const req = context.request();
        req.header = { 'X-Custom-Headerfield' : 'Its one header, with headerfields' };
        assert.deepEqual( req.header, req.req.headers );
    } );
} );
