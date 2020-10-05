/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 * 
 * File: request/host.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/05/2020
 * Description: 
 ******************************************************************/

import assert from 'assert';
import context from '../helpers/context';

describe( 'req.host', () => {
    it( 'should return host with port', () => {
        const req = context.request();
        req.header.host = 'foo.com:3000';
        assert.equal( req.host, 'foo.com:3000' );
    } );

    describe( 'with no host present', () => {
        it( 'should return ""', () => {
            const req = context.request();
            assert.equal( req.host, '' );
        } );
    } );

    describe( 'when less then HTTP/2', () => {
        it( 'should not use :authority header', () => {
            const req = context.request( {
                'httpVersionMajor': 1,
                'httpVersion': '1.1'
            } );
            req.header[ ':authority' ] = 'foo.com:3000';
            req.header.host = 'bar.com:8000';
            assert.equal( req.host, 'bar.com:8000' );
        } );
    } );

    describe( 'when HTTP/2', () => {
        it( 'should use :authority header', () => {
            const req = context.request( {
                'httpVersionMajor': 2,
                'httpVersion': '2.0'
            } );
            req.header[ ':authority' ] = 'foo.com:3000';
            req.header.host = 'bar.com:8000';
            assert.equal( req.host, 'foo.com:3000' );
        } );

        it( 'should use host header as fallback', () => {
            const req = context.request( {
                'httpVersionMajor': 2,
                'httpVersion': '2.0'
            } );
            req.header.host = 'bar.com:8000';
            assert.equal( req.host, 'bar.com:8000' );
        } );
    } );

    describe( 'when X-Forwarded-Host is present', () => {
        describe( 'and proxy is not trusted', () => {
            it( 'should be ignored on HTTP/1', () => {
                const req = context.request();
                req.header[ 'x-forwarded-host' ] = 'bar.com';
                req.header.host = 'foo.com';
                assert.equal( req.host, 'foo.com' );
            } );

            it( 'should be ignored on HTTP/2', () => {
                const req = context.request( {
                    'httpVersionMajor': 2,
                    'httpVersion': '2.0'
                } );
                req.header[ 'x-forwarded-host' ] = 'proxy.com:8080';
                req.header[ ':authority' ] = 'foo.com:3000';
                req.header.host = 'bar.com:8000';
                assert.equal( req.host, 'foo.com:3000' );
            } );
        } );

        describe( 'and proxy is trusted', () => {
            it( 'should be used on HTTP/1', () => {
                const req = context.request();
                req.app.proxy = true;
                req.header[ 'x-forwarded-host' ] = 'bar.com, baz.com';
                req.header.host = 'foo.com';
                assert.equal( req.host, 'bar.com' );
            } );

            it( 'should be used on HTTP/2', () => {
                const req = context.request( {
                    'httpVersionMajor': 2,
                    'httpVersion': '2.0'
                } );
                req.app.proxy = true;
                req.header[ 'x-forwarded-host' ] = 'proxy.com:8080';
                req.header[ ':authority' ] = 'foo.com:3000';
                req.header.host = 'bar.com:8000';
                assert.equal( req.host, 'proxy.com:8080' );
            } );
        } );
    } );
} );
