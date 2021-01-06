/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-after.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/27/2020
 * Description:
 ******************************************************************/

import { InterceptorAfter, Methods } from './interceptor.interface';
import extract from './extract';

function createInterceptorAfter<T>( descriptor: PropertyDescriptor ): InterceptorAfter<T>;
function createInterceptorAfter<T>( descriptor: PropertyDescriptor, methods: Methods ): InterceptorAfter<T>;
function createInterceptorAfter<T>( descriptor: PropertyDescriptor, methods: undefined ): InterceptorAfter<T>;

function createInterceptorAfter<T>( descriptor: PropertyDescriptor, methods?: Methods | undefined ): InterceptorAfter<T> {

    /**
     * the returns Promsie object should be resolved with the original value as default
     */
    if( !methods ) return value => Promise.resolve( value );

    const bound = extract.after( descriptor, methods );

    return async( value, ...args ) => {
        let res = await value;

        /**
         * the methods shoule be called in sequence
         */
        for( const info of bound ) {
            res = await info.method( info.metadata, ...args ); // eslint-disable-line no-await-in-loop
        }

        return res;
    };
}

export default createInterceptorAfter;
