/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/body.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/21/2020
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import { KEY_BEFORE } from '@ynn/method-interceptor';
import { Body } from '../../src/decorators/body.decorator';

describe( 'decorator/body', () => {
    describe( 'Method decorator', () => {
        it( '@Body()', () => {
            class Controller {
                @Body()
                action() {}
            }

            const descriptor = Reflect.getOwnPropertyDescriptor( Controller.prototype, 'action' )!;

            const metadata = Reflect.getMetadata( KEY_BEFORE, descriptor.value );

            console.log( metadata );
        } );
    } );

    describe( 'Parameter decorator', () => {
    } );
} );
