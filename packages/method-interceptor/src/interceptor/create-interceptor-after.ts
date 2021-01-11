/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-after.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/27/2020
 * Description:
 ******************************************************************/

import { InterceptorAfter, Methods, MethodAfter } from './interceptor.interface';
import extract from './extract';

function createInterceptorAfter<T>(
    descriptor: Readonly<PropertyDescriptor>,
    methods?: Readonly<Methods<MethodAfter>> | undefined
): InterceptorAfter<T> {

    /**
     * the returns Promsie object should be resolved with the original value as default
     */
    if( !methods ) return async <P>( value: P ): Promise<P> => Promise.resolve( value );

    const bound = extract.after( descriptor, methods );

    return async ( value, ...args ): Promise<unknown> => {
        let res = await value;

        /**
         * the methods shoule be called in sequence
         */
        for( const info of bound ) {
            res = await info.method( res, info.metadata, ...args ); // eslint-disable-line no-await-in-loop
        }

        return res;
    };
}

export default createInterceptorAfter;
