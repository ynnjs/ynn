/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/body.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/21/2020
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import body from '../../src/interceptors/body';
import { Body } from '../../src';

describe( 'interceptor/body', () => {
    
} );

describe( 'decorator/body', () => {
    describe( 'Method decorator', () => {
        it( '@Body()', () => {
            class Controller {
                @Body()
                action() {}
            }

            new Controller();
        } );        
    } );

    describe( 'Parameter decorator', () => {
        
    } );
} );
