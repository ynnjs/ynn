/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptor/create-interceptor-finally.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/05/2021
 * Description:
 ******************************************************************/

import { GlobalFunction } from '@ynn/utility-types';
import { KEY_FINALLY } from '../constants';
import { MetadataFinally } from '../metadata';
import extractMethods from './extract-methods';

export interface InterceptorFinally<T extends unknown[] = unknown[]> {
    ( ...args: T ): Promise<unknown>;
}

/**
 * @typeparam T
 *
 * @param descriptorOrConstructor
 */
export function createInterceptorFinally<T extends unknown[] = unknown[]>(
    descriptorOrConstructor: Readonly<PropertyDescriptor> | GlobalFunction
): InterceptorFinally<T> {

    const bound = extractMethods( KEY_FINALLY, descriptorOrConstructor );

    return async ( ...args: T ): Promise<unknown[]> => {
        const promises: unknown[] = [];

        bound.forEach( info => {
            promises.push( info.method( info.metadata as MetadataFinally, ...args ) );
        } );

        return Promise.all( promises );
    };
}
