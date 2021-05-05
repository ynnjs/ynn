/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/default.pipe.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/26/2021
 * Description:
 ******************************************************************/

import { PipeFunction, Metadata, Context } from '@ynn/common';

interface Callback<T> {
    ( value: '' | null | undefined, ctx: Context, metadata: Metadata ): T | Promise<T>;
}

export type DefaultCallback<T> = T extends any ? ( T | Callback<T> ) : never;

/**
 * @example
 *
 * ```ts
 * @Action()
 * fn( @Query( 'id', Default( 'defaultid' ) ) id: string ) {}
 * ```
 */
export function Default<D extends any>( defaultValue: DefaultCallback<D> ): PipeFunction {
    return async <T extends any>( value: T, ctx: Context, metadata: Metadata ): Promise<T | D> => {
        if( value === '' || value === undefined || value === null ) {
            if( typeof defaultValue === 'function' ) {
                return defaultValue( value, ctx, metadata );
            }
            return defaultValue;
        }
        return value;
    };
}
