/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptors.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/26/2020
 * Description:
 ******************************************************************/

import { VariadicClass } from '@ynn/utility-types';
import {
    Methods, MethodBefore, MethodAfter, MethodParameter, MethodException,
    InterceptorBefore, InterceptorAfter, InterceptorException, InterceptorParameter
} from './interceptor.interface';
import createInterceptorBefore from './create-interceptor-before';
import createInterceptorAfter from './create-interceptor-after';
import createInterceptorException from './create-interceptor-exception';
import createInterceptorParameter from './create-interceptor-parameter';

export interface CreateInterceptorsOptions {
    methodsBefore?: Methods<MethodBefore>;
    methodsAfter?: Methods<MethodAfter>;
    methodsException?: Methods<MethodException>;
    methodsParamter?: Methods<MethodParameter>;
}

/**
 * @typeparam T - The type of arguments that would be passed to the generated interceptor methods
 * @typeparam P - The type of parameters property in metadata
 */
export default function createInterceptors<T, P>(
    constructor: VariadicClass,
    descriptor: Readonly<PropertyDescriptor>,
    methodName: string,
    options?: CreateInterceptorsOptions
): {
    before: InterceptorBefore<T>;
    after: InterceptorAfter<T>;
    exception: InterceptorException<T>;
    parameter: InterceptorParameter<T>;
} {

    return {
        before : createInterceptorBefore<T, P>( descriptor, options?.methodsBefore ),
        after : createInterceptorAfter<T, P>( descriptor, options?.methodsAfter ),
        exception : createInterceptorException<T, P>( descriptor, options?.methodsException ),
        parameter : createInterceptorParameter<T>( constructor, methodName )
    };
}
