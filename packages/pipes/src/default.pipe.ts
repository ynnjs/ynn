/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/default.pipe.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/26/2021
 * Description:
 ******************************************************************/

import { PipeFunction } from '@ynn/core';

export interface DefaultCallback<T> {
    ( value: null | undefined, ctx: Context, metadata: Metadata ): T | Promise<T>;
}

/**
 * @example
 *
 * ```ts
 * @Action()
 * fn( @Query( 'id', Default( 'defaultid' ) ) id: string ) {}
 * ```
 */
export function Default<D>( defaultValue: DefaultCallback<D> | D ): PipeFunction {
    return async <T>( value: T, ctx: Context, metadata: Metadata ): Promise<T | D> => {
        if( value === '' || value === undefined || value === null ) {
            return typeof defaultValue === 'function' ? defaultValue( value, ctx, metadata ) : defaultValue;
        }
        return value;
    };
}
