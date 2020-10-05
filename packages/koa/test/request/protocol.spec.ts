/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 * 
 * File: request/protocol.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/05/2020
 * Description: 
 ******************************************************************/

import assert from 'assert';
import { request } from '../helpers/context';

describe( 'req.protocol', () => {
    describe( 'when encrypted', () => {
        it( 'should return "https"', () => {
            const req = request();
            req.req.socket = { encrypted: true };
            assert.equal( req.protocol, 'https' );
        } );
    } );

    describe( 'when unencrypted', () => {
        it( 'should return "http"', () => {
            const req = request();
            req.req.socket = {};
            assert.equal( req.protocol, 'http' );
        } );
    } );

    describe( 'when X-Forwarded-Proto is set', () => {
        describe( 'and proxy is trusted', () => {
            it( 'should be used', () => {
                const req = request();
                req.app.proxy = true;
                req.req.socket = {};
                req.header[ 'x-forwarded-proto' ] = 'https, http';
                assert.equal( req.protocol, 'https' );
            } );

            describe( 'and X-Forwarded-Proto is empty', () => {
                it( 'should return "http"', () => {
                    const req = request();
                    req.app.proxy = true;
                    req.req.socket = {};
                    req.header[ 'x-forwarded-proto' ] = '';
                    assert.equal( req.protocol, 'http' );
                } );
            } );
        } );

        describe( 'and proxy is not trusted', () => {
            it( 'should not be used', () => {
                const req = request();
                req.req.socket = {};
                req.header[ 'x-forwarded-proto' ] = 'https, http';
                assert.equal( req.protocol, 'http' );
            } );
        } );
    } );
} );
