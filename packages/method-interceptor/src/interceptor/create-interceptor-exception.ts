/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-exception.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/28/2020
 * Description:
 ******************************************************************/

import { KEY_EXCEPTION } from '../constants';
import { MetadataException } from '../metadata.interface';
import { InterceptorException, Methods, MethodException } from './interceptor.interface';
import extractMethods from './extract-methods';

function createInterceptorException<T extends unknown[]>(
    descriptor: Readonly<PropertyDescriptor>,
    methods?: Readonly<Methods<MethodException<T>>>
): InterceptorException<T> {

    /**
     * throw the exception directly if there is no methods provided.
     */
    if( !methods ) {
        return async ( e: unknown, ...args: T ): Promise<unknown> => { // eslint-disable-line @typescript-eslint/no-unused-vars
            throw e;
        };
    }

    const bound = extractMethods( KEY_EXCEPTION, descriptor, methods );

    return async ( e, ...args ): Promise<unknown> => {

        for( const info of bound ) {
            const metadata = info.metadata as MetadataException;

            if( metadata.exceptionType === undefined || e instanceof metadata.exceptionType ) {
                return info.method( metadata, e, ...args );
            }
        }

        throw e;
    };
}

export default createInterceptorException;
