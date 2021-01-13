/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptors.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/26/2020
 * Description:
 ******************************************************************/
import { VariadicClass } from '@ynn/utility-types';
import { Methods, MethodBefore, MethodAfter, MethodParameter, MethodException, InterceptorBefore, InterceptorAfter, InterceptorException, InterceptorParameter } from './interceptor.interface';
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
export default function createInterceptors<T, P>(constructor: VariadicClass, descriptor: Readonly<PropertyDescriptor>, methodName: string, options?: CreateInterceptorsOptions): {
    before: InterceptorBefore<T>;
    after: InterceptorAfter<T>;
    exception: InterceptorException<T>;
    parameter: InterceptorParameter<T>;
};
