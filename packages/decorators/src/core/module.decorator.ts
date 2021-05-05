/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: core/module.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 05/03/2021
 * Description:
 ******************************************************************/

import { MODULE_METADATA_KEY } from '@ynn/common';

export function Module<T>( options?: T ): ClassDecorator {
    return ( target ): void => {
        Reflect.defineMetadata( MODULE_METADATA_KEY, options, target );
    };
}
