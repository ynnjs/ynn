/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: test/index.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 05/03/2021
 * Description:
 ******************************************************************/

import { Action } from '../src';

describe( '@ynn/decorators', () => {
    describe( 'exports', () => {
        it( 'should have exported Action decorator', () => {
            expect( Action ).toBeTruthy();
        } );
    } );

} );
