/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 *
 * File: context/toJSON.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/05/2020
 * Description:
 ******************************************************************/

import assert from 'assert';
import context from '../helpers/context';

describe( 'ctx.toJSON()', () => {
    it( 'should return a json representation', () => {
        const ctx = context();

        ctx.req.method = 'POST';
        ctx.req.url = '/items';
        ctx.req.headers[ 'content-type' ] = 'text/plain';
        ctx.status = 200;
        ctx.body = '<p>Hey</p>';

        const obj = JSON.parse( JSON.stringify( ctx ) );
        const req = obj.request;
        const res = obj.response;

        assert.deepEqual( {
            method : 'POST',
            url : '/items',
            headers : {
                'content-type' : 'text/plain'
            }
        }, req );

        assert.deepEqual( {
            status : 200,
            message : 'OK',
            headers : {
                'content-type' : 'text/html; charset=utf-8',
                'content-length' : '10'
            }
        }, res );
    } );
} );
