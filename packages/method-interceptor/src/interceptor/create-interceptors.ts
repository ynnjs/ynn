/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptors.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/26/2020
 * Description:
 ******************************************************************/

import { Methods } from './interceptor.interface';
import createInterceptorBefore from './create-interceptor-before';
import createInterceptorAfter from './create-interceptor-after';
import createInterceptorException from './create-interceptor-exception';
import createInterceptorParameter from './create-interceptor-parameter';

export interface CreateInterceptorsOptions {
    methodsBefore?: Methods;
}

/**
 * @typeparam T - The type of arguments that would be passed to the generated interceptor methods
 * @typeparam P - The type of parameters property in metadata
 */
export default function createInterceptors<T, P>(
    constructor: new ( ...args: any[] ) => any,
    descriptor: PropertyDescriptor,
    methodName: string,
    options?: CreateInterceptorsOptions
) {

    return {
        before : createInterceptorBefore<T, P>( descriptor, options?.methodsBefore ),
        after : createInterceptorAfter<T, P>( descriptor, options?.methodsAfter ),
        exception : createInterceptorException<T, P>( descriptor, options?.methodsException ),
        parameter : createInterceptorParameter<T>( constructor, methodName, )
    };
}
