/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-exception.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/28/2020
 * Description:
 ******************************************************************/

import { InterceptorException, Methods, MethodException } from './interceptor.interface';
import extract from './extract';

function createInterceptorException<T>(
    descriptor: Readonly<PropertyDescriptor>,
    methods?: Readonly<Methods<MethodException>> | undefined
): InterceptorException<T> {

    /**
     * throw the exception directly if there is no methods provided.
     */
    if( !methods ) return ( e: unknown ): void => { throw e };

    const bound = extract.exception( descriptor, methods );

    return async ( e, ...args ): Promise<unknown> => {

        for( const info of bound ) {
            if( info.metadata.exceptionType === undefined || e instanceof info.metadata.type ) {
                return info.method( e, info.metadata, ...args );
            }
        }

        throw e;
    };
}

export default createInterceptorException;
