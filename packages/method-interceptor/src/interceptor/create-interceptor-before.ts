/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-before.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/26/2020
 * Description:
 ******************************************************************/

import { MetadataBefore } from '../metadata.interface';
import { KEY_BEFORE } from '../constants';
import { InterceptorBefore, Methods, MethodBefore } from './interceptor.interface';
import extractMethods from './extract-methods';

/**
 * create an empty interceptor method with methods is undefined.
 *
 * @typeparam T - the type of the arguments that will passed to the generated interceptor methods.
 *
 * @returns a `Promise` object that resolves nothing.
 */
function createInterceptorBefore<T extends unknown[]>(
    descriptor: Readonly<PropertyDescriptor>,
    methods?: Readonly<Methods<MethodBefore<T>>>
): InterceptorBefore<T> {

    if( !methods ) return async (): Promise<[]> => Promise.resolve( [] );

    const bound = extractMethods( KEY_BEFORE, descriptor, methods );

    return async ( ...args: T ): Promise<unknown[]> => {
        const promises: unknown[] = [];

        bound.forEach( info => {
            promises.push( info.method( info.metadata as MetadataBefore, ...args ) );
        } );

        return Promise.all( promises );
    };
}

export default createInterceptorBefore;
