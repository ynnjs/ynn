/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: context/assert.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/02/2020
 * Description: 
 ******************************************************************/

import context from '../helpers/context';

describe( 'ctx.assert( value, status )', () => {
    it( 'should throw an error', () => {
        const ctx = context(); 

        try {
            ctx.assert( false, 404 );
            throw new Error( 'asdf' );
        } catch( e ) {
            expect( e.status ).toEqual( 404 );
            expect( e.expose ).toEqual( true );
        }
    } );
    
} );
