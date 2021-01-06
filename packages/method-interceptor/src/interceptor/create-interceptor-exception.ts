/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-exception.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/28/2020
 * Description:
 ******************************************************************/

import { InterceptorException, Methods } from './interceptor.interface';
import extract from './extract';

function createInterceptorException<T = any[]>( descriptor: PropertyDescriptor ): InterceptorException<T>;

function createInterceptorException<T = any[]>( descriptor: PropertyDescriptor, methods: undefined ): InterceptorException<T>;

function createInterceptorException<T = any[]>( descriptor: PropertyDescriptor, methods: Methods ): InterceptorException<T>;


function createInterceptorException( descriptor, methods ) {

    /**
     * throw the exception directly if there is no methods provided.
     */
    if( !methods ) return ( e: any ): any => { throw e };

    const bound = extract.exception( descriptor, methods );

    return ( e, ...args ) => {

        for( const info of bound ) {
            if( info.metadata.exceptionType === undefined || e instanceof info.metadata.type ) {
                return info.method( e, ...args );
            }
        }

        throw e;
    };
}

export default createInterceptorException;
