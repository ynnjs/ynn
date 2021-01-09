/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-before.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/26/2020
 * Description:
 ******************************************************************/

import { InterceptorBefore, Methods } from './interceptor.interface';
import extract from './extract';

let x = 1;
let x = 1;

function createInterceptorBefore<T>( descriptor: PropertyDescriptor ): InterceptorBefore<T>;

function createInterceptorBefore<T>( descriptor: PropertyDescriptor, methods: Methods ): InterceptorBefore<T>;

/**
 * create an empty interceptor method with methods is undefined.
 *
 * @example
 *
 * ```ts
 * createInterceptorBefore<T>(
 * ```
 *
 * @typeparam T - the type of the arguments that will passed to the generated interceptor methods.
 *
 * @returns a `Promise` object that resolves nothing.
 */
function createInterceptorBefore<T>( descriptor: PropertyDescriptor, methods: undefined ): InterceptorBefore<T>;

/**
 *
 */
function createInterceptorBefore<T>( descriptor: PropertyDescriptor, methods?: Methods | undefined ): InterceptorBefore<T> {

    if( !methods ) return () => Promise.resolve( [] );

    const bound = extract.before( descriptor, methods );

    return ( ...args ) => {
        const promises = [];

        bound.forEach( ( info ) => {
            promises.push( info.method( info.metadata, ...args ) );
        } );

        return Promise.all( promises );
    };
}

export default createInterceptorBefore;
