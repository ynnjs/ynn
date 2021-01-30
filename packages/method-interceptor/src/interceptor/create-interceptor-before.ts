/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-before.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/26/2020
 * Description:
 ******************************************************************/

import { MetadataBefore } from '../metadata';
import { KEY_BEFORE } from '../constants';
import extractMethods from './extract-methods';

/**
 * create an empty interceptor method with methods is undefined.
 *
 * @typeparam T - the type of the arguments that will passed to the generated interceptor methods.
 *
 * @returns a `Promise` object that resolves nothing.
 */
function createInterceptorBefore<T extends unknown[] = unknown[]>(
    descriptor: Readonly<PropertyDescriptor>
): ( ...args: T ) => Promise<unknown> {

    const bound = extractMethods( KEY_BEFORE, descriptor );

    return async ( ...args: T ): Promise<unknown[]> => {
        const promises: unknown[] = [];

        bound.forEach( info => {
            promises.push( info.method( info.metadata as MetadataBefore, ...args ) );
        } );

        return Promise.all( promises );
    };
}

export default createInterceptorBefore;
