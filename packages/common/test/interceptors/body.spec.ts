/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptors/body.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/29/2021
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import { body } from '../../src/interceptors/before';


describe( 'interceptor/body', () => {

    it( '', () => {
        body( {} );
    } );

} );
