/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 * 
 * File: response/vary.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/06/2020
 * Description: 
 ******************************************************************/

import assert from 'assert';
import context from '../helpers/context';

describe( 'ctx.vary( field )', () => {
    describe( 'when Vary is not set', () => {
        it( 'should set it', () => {
            const ctx = context();
            ctx.vary( 'Accept' );
            assert.equal( ctx.response.header.vary, 'Accept' );
        } );
    } );

    describe( 'when Vary is set', () => {
        it( 'should append', () => {
            const ctx = context();
            ctx.vary( 'Accept' );
            ctx.vary( 'Accept-Encoding' );
            assert.equal( ctx.response.header.vary, 'Accept, Accept-Encoding' );
        } );
    } );

    describe( 'when Vary already contains the value', () => {
        it( 'should not append', () => {
            const ctx = context();
            ctx.vary( 'Accept' );
            ctx.vary( 'Accept-Encoding' );
            ctx.vary( 'Accept' );
            ctx.vary( 'Accept-Encoding' );
            assert.equal( ctx.response.header.vary, 'Accept, Accept-Encoding' );
        } );
    } );
} );
