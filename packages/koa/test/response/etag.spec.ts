/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 * 
 * File: response/etag.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/06/2020
 * Description: 
 ******************************************************************/

import assert from 'assert';
import { response } from '../helpers/context';

describe( 'res.etag=', () => {
    it( 'should not modify an etag with quotes', () => {
        const res = response();
        res.etag = '"asdf"';
        assert.equal( res.header.etag, '"asdf"' );
    } );

    it( 'should not modify a weak etag', () => {
        const res = response();
        res.etag = 'W/"asdf"';
        assert.equal( res.header.etag, 'W/"asdf"' );
    } );

    it( 'should add quotes around an etag if necessary', () => {
        const res = response();
        res.etag = 'asdf';
        assert.equal( res.header.etag, '"asdf"' );
    } );
} );

describe( 'res.etag', () => {
    it( 'should return etag', () => {
        const res = response();
        res.etag = '"asdf"';
        assert.equal( res.etag, '"asdf"' );
    } );
} );
