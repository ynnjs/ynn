/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-before.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/26/2020
 * Description:
 ******************************************************************/

import { InterceptorBefore, Methods, MethodBefore } from './interceptor.interface';
import extract from './extract';

/**
 * create an empty interceptor method with methods is undefined.
 *
 * @example
 *
 * ```ts
 * createInterceptorBefore<T>()
 * ```
 *
 * @typeparam T - the type of the arguments that will passed to the generated interceptor methods.
 *
 * @returns a `Promise` object that resolves nothing.
 */
function createInterceptorBefore<T>(
    descriptor: Readonly<PropertyDescriptor>,
    methods?: Readonly<Methods<MethodBefore>> | undefined
): InterceptorBefore<T> {

    if( !methods ) return async (): Promise<[]> => Promise.resolve( [] );

    const bound = extract.before( descriptor, methods );

    return async ( ...args ): Promise<unknown[]> => {
        const promises = [];

        bound.forEach( ( info ) => {
            promises.push( info.method( info.metadata, ...args ) );
        } );

        return Promise.all( promises );
    };
}

export default createInterceptorBefore;
