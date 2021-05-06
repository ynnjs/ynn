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

export type DefaultCallback<T> = T extends Function ? Callback<T> : T; // eslint-disable-line

/**
 * @example
 *
 * ```ts
 * @Action()
 * fn( @Query( 'id', Default( 'defaultid' ) ) id: string ) {}
 * ```
 */
export function Default<D>( defaultValue: DefaultCallback<D> ): PipeFunction {
    return async <T>( value: T, ctx: Context, metadata: Metadata ): Promise<T | D> => {
        if( value as unknown === '' || value === undefined || value === null ) {
            if( typeof defaultValue === 'function' ) {
                return defaultValue( value, ctx, metadata );
            }
            return defaultValue as D;
        }
        return value;
    };
}
