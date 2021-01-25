/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: test/storage.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/25/2021
 * Description:
 ******************************************************************/

import Storage from '../src/storage';

describe( 'Storage', () => {
    describe( 'Storage.key', () => {
        it( 'should generate different keys', () => {
            const keys: Set<string> = new Set();
            for( let i = 0; i < 100; i += 1 ) {
                keys.add( Storage.key() );
            }
            expect( keys.size ).toEqual( 100 );
        } );

        it( 'should generate a string key', () => {
            expect( typeof Storage.key( '', 'string' ) ).toEqual( 'string' );
        } );

        it( 'should generate a symbol key', () => {
            expect( typeof Storage.key() ).toEqual( 'symbol' );
        } );

        it( 'should use the prefix in string', () => {
            expect( Storage.key( 'prefix-', 'string' ) ).toMatch( /^prefix-/ );
        } );

        it( 'should use the prefix in string', () => {
            expect( Storage.key( 'prefix-' ).toString() ).toMatch( /^Symbol\(prefix-/ );
        } );
    } );
    it( 'using string key', () => {
        const fn = () => {};
        const key = Storage.key( '', 'string' );
        Storage.set( key, fn );
        expect( Storage.get( key ) ).toEqual( fn );
    } );

    it( 'using symbol key', () => {
        const fn = () => {};
        const key = Storage.key();
        Storage.set( key, fn );
        expect( Storage.get( key ) ).toEqual( fn );
    } );
} );
