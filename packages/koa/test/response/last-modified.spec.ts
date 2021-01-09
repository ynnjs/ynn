/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 *
 * File: response/last-modified.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/06/2020
 * Description:
 ******************************************************************/

import assert from 'assert';
import { response } from '../helpers/context';

describe( 'res.lastModified', () => {
    it( 'should set the header as a UTCString', () => {
        const res = response();
        const date = new Date();
        res.lastModified = date;
        assert.equal( res.header[ 'last-modified' ], date.toUTCString() );
    } );

    it( 'should work with date strings', () => {
        const res = response();
        const date = new Date();
        res.lastModified = date.toString();
        assert.equal( res.header[ 'last-modified' ], date.toUTCString() );
    } );

    it( 'should get the header as a Date', () => {
        // Note: Date() removes milliseconds, but it's practically important.
        const res = response();
        const date = new Date();
        res.lastModified = date;
        assert.equal( ( res.lastModified.getTime() / 1000 ), Math.floor( date.getTime() / 1000 ) );
    } );

    describe( 'when lastModified not set', () => {
        it( 'should get undefined', () => {
            const res = response();
            assert.equal( res.lastModified, undefined );
        } );
    } );
} );
