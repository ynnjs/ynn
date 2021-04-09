/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-after.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/27/2020
 * Description:
 ******************************************************************/

import { GlobalFunction } from '@ynn/utility-types';
import { KEY_AFTER } from '../constants';
import { MetadataAfter } from '../metadata';
import extractMethods from './extract-methods';

export interface InterceptorAfter<T extends unknown[] = unknown[]> {
    ( value: unknown, ...args: T ): Promise<unknown>;
}

/**
 * @typeparam T
 *
 * @returns
 */
export function createInterceptorAfter<T extends unknown[] = unknown[]>(
    descriptorOrConstructor: Readonly<PropertyDescriptor> | GlobalFunction
): InterceptorAfter<T> {

    const bound = extractMethods( KEY_AFTER, descriptorOrConstructor );

    return async ( value: unknown, ...args: T ): Promise<unknown> => {
        let res: unknown = await Promise.resolve( value );

        /**
         * the methods shoule be called in sequence
         */
        for( const info of bound ) {
            res = await info.method( info.metadata as MetadataAfter, res, ...args ); // eslint-disable-line no-await-in-loop
        }

        return res;
    };
}
