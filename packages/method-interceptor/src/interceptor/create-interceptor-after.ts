/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-after.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/27/2020
 * Description:
 ******************************************************************/

import { KEY_AFTER } from '../constants';
import { MetadataAfter } from '../metadata.interface';
import extractMethods from './extract-methods';

/**
 * @typeparam T
 * @typeparam V
 *
 * @returns
 */
function createInterceptorAfter<V = unknown, T extends unknown[] = unknown[]>(
    descriptor: Readonly<PropertyDescriptor>
): ( value: V, ...args: T ) => Promise<unknown> {

    const bound = extractMethods( KEY_AFTER, descriptor );

    return async ( value: V, ...args: T ): Promise<unknown> => {
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

export default createInterceptorAfter;
