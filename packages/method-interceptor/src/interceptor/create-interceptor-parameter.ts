/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptor/create-interceptor-parameter.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/05/2021
 * Description:
 ******************************************************************/

import { VariadicClass } from '@ynn/utility-types';
import { InterceptorParameter, Methods } from './interceptor.interface';
import extract from './extract';

function createInterceptorParameter<T>( constructor: VariadicClass, methodName: string, methods?: Methods | undefined ): InterceptorParameter<T> {

    const bound = extract.parameter( constructor, methodName, methods );

    return async ( ...args ): Promise<unknown[]> => {
        const promises = [];

        bound.forEach( ( info ) => {
            promises.push( info.method( info.metadata, ...args ) );
        } );

        return Promise.all( promises );
    };
}

export default createInterceptorParameter;
