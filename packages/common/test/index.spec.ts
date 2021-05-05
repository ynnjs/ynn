/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: test/index.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 05/03/2021
 * Description:
 ******************************************************************/

import {
    LoggerService,
    ACTION_METADATA_KEY,
    MODULE_METADATA_KEY
} from '../src';

describe( '@ynn/common', () => {
    describe( 'services', () => {
        it( 'should export LoggerService', () => {
            expect( LoggerService ).toBeTruthy();
        } );
    } );

    describe( 'constants', () => {
        it( 'should have exported ACTION_METADATA_KEY with a Symbol value', () => {
            expect( typeof ACTION_METADATA_KEY ).toEqual( 'symbol' );
        } );

        it( 'should have exported MODULE_METADATA_KEY with a Symbol value', () => {
            expect( typeof MODULE_METADATA_KEY ).toEqual( 'symbol' );
        } );
    } );
} );
