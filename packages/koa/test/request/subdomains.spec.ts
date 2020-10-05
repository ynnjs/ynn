/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 * 
 * File: request/subdomains.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/05/2020
 * Description: 
 ******************************************************************/

import assert from 'assert';
import { request } from '../helpers/context';

describe( 'req.subdomains', () => {
    it( 'should return subdomain array', () => {
        const req = request();
        req.header.host = 'tobi.ferrets.example.com';
        req.app.subdomainOffset = 2;
        assert.deepEqual( req.subdomains, [ 'ferrets', 'tobi' ]);

        req.app.subdomainOffset = 3;
        assert.deepEqual( req.subdomains, [ 'tobi' ]);
    } );

    it( 'should work with no host present', () => {
        const req = request();
        assert.deepEqual( req.subdomains, [] );
    } );

    it( 'should check if the host is an ip address, even with a port', () => {
        const req = request();
        req.header.host = '127.0.0.1:3000';
        assert.deepEqual( req.subdomains, [] );
    } );
} );
