/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/default.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/26/2021
 * Description:
 ******************************************************************/

import { PipeFunction } from '@ynn/common';

export function Default<T>( defaultValue: T ): PipeFunction {
    return ( value: T ): T => {
        if( value === undefined || value === null ) return defaultValue;
        return value;
    };
}
