/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: core/injectable.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 05/04/2021
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import { INJECTABLE_METADATA_KEY, Scope } from '@ynn/common';

export interface InjectableOptions {
    scope: Scope;
}

export function Injectable( options?: InjectableOptions ): ClassDecorator {
    return ( target ): void => {
        Reflect.defineMetadata( INJECTABLE_METADATA_KEY, options, target );
    };
}
