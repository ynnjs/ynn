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
import { InterceptorAfter, Methods, MethodAfter } from './interceptor.interface';
import extractMethods from './extract-methods';

/**
 * @typeparam T
 * @typeparam V
 *
 * @returns
 */
function createInterceptorAfter<V = unknown, T extends unknown[] = unknown[]>(
    descriptor: Readonly<PropertyDescriptor>,
    methods?: Readonly<Methods<MethodAfter<T>>>
): InterceptorAfter<V, T> {

    /**
     * the returns Promsie object should be resolved with the original value as default
     */
    if( !methods ) {
        return async <P>( value: P, ...args: T ): Promise<P> => Promise.resolve( value ); // eslint-disable-line @typescript-eslint/no-unused-vars
    }

    const bound = extractMethods( KEY_AFTER, descriptor, methods );

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
