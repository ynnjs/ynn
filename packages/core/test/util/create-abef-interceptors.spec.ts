/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/create-abef-interceptors.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/11/2021
 * Description:
 ******************************************************************/

import { createABEFInterceptors } from '../../src/util/create-abef-interceptors';

describe( 'ynn/core/util/create-abef-interceptors', () => {
    it( 'create interceptors for a constructor', () => {
        class A {}
        const interceptors = createABEFInterceptors( A );
        expect( interceptors.length ).toEqual( 4 );
    } );

    it( 'create interceptors for a descriptor', () => {
        const o = { x : (): string => 'descriptor' };
        const descriptor = Reflect.getOwnPropertyDescriptor( o, 'x' ) as PropertyDescriptor;
        const interceptors = createABEFInterceptors( descriptor );
        expect( interceptors.length ).toEqual( 4 );
    } );
} );
