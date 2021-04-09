/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-before.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/26/2020
 * Description:
 ******************************************************************/

import { GlobalFunction } from '@ynn/utility-types';
import { MetadataBefore } from '../metadata';
import { KEY_BEFORE } from '../constants';
import extractMethods from './extract-methods';

export interface InterceptorBefore<T extends unknown[] = unknown[]> {
    ( ...args: T ): Promise<unknown>;
}

/**
 * create an empty interceptor method with methods is undefined.
 *
 * @typeparam T - the type of the arguments that will passed to the generated interceptor methods.
 *
 * @param descriptorOrConstructor - the descriptor of class method or the constructor of the class
 *
 * @returns a `Promise` object that resolves nothing.
 */
export function createInterceptorBefore<T extends unknown[] = unknown[]>(
    descriptorOrConstructor: Readonly<PropertyDescriptor> | GlobalFunction
): InterceptorBefore<T> {

    const bound = extractMethods( KEY_BEFORE, descriptorOrConstructor );

    return async ( ...args: T ): Promise<unknown[]> => {
        const promises: unknown[] = [];

        bound.forEach( info => {
            promises.push( info.method( info.metadata as MetadataBefore, ...args ) );
        } );

        return Promise.all( promises );
    };
}
