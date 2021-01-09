/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptors.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/26/2020
 * Description:
 ******************************************************************/
import { Methods } from './interceptor.interface';
export interface CreateInterceptorsOptions {
    methodsBefore?: Methods;
}
/**
 * @typeparam T - The type of arguments that would be passed to the generated interceptor methods
 * @typeparam P - The type of parameters property in metadata
 */
export default function createInterceptors<T, P>(constructor: new (...args: any[]) => any, descriptor: PropertyDescriptor, methodName: string, options?: CreateInterceptorsOptions): {
    before: import("./interceptor.interface").InterceptorBefore<T>;
    after: import("./interceptor.interface").InterceptorAfter<T>;
    exception: import("./interceptor.interface").InterceptorException<T>;
    parameter: any;
};
