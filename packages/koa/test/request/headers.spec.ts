/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 *
 * File: request/headers.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/05/2020
 * Description:
 ******************************************************************/


import assert from 'assert';
import context from '../helpers/context';

describe( 'req.headers', () => {
    it( 'should return the request header object', () => {
        const req = context.request();
        assert.deepEqual( req.headers, req.req.headers );
    } );

    it( 'should set the request header object', () => {
        const req = context.request();
        req.headers = { 'X-Custom-Headerfield' : 'Its one header, with headerfields' };
        assert.deepEqual( req.headers, req.req.headers );
    } );
} );
