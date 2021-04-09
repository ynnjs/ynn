/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/default.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/26/2021
 * Description:
 ******************************************************************/

import { PipeFunction } from '@ynn/core';

/**
 * @example
 *
 * ```ts
 * @Action()
 * fn( @Query( 'id', Default( 'defaultid' ) ) id: string ) {}
 * ```
 */
export function Default<T>( defaultValue: T ): PipeFunction {
    return ( value: T ): T => {
        if( value === undefined || value === null ) return defaultValue;
        return value;
    };
}
