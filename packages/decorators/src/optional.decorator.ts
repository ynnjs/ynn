/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/optional.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/24/2021
 * Description:
 ******************************************************************/

import { Context, ParameterMetadata, createParameterDecorator } from '@ynn/common';

export function Optional<T>( defaultValue?: T ): ParameterDecorator {
    return createParameterDecorator( ( metadata: ParameterMetadata, ctx: Context, val: T ): T => {
        if( val === undefined || val === null ) return defaultValue ?? val;
        return val;
    } );
}
