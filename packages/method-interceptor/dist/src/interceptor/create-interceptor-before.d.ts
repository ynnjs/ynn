/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-before.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/26/2020
 * Description:
 ******************************************************************/
import { InterceptorBefore, Methods } from './interceptor.interface';
declare function createInterceptorBefore<T>(descriptor: PropertyDescriptor): InterceptorBefore<T>;
declare function createInterceptorBefore<T>(descriptor: PropertyDescriptor, methods: Methods): InterceptorBefore<T>;
/**
 * create an empty interceptor method with methods is undefined.
 *
 * @example
 *
 * ```ts
 * createInterceptorBefore<T>(
 * ```
 *
 * @typeparam T - the type of the arguments that will passed to the generated interceptor methods.
 *
 * @returns a `Promise` object that resolves nothing.
 */
declare function createInterceptorBefore<T>(descriptor: PropertyDescriptor, methods: undefined): InterceptorBefore<T>;
export default createInterceptorBefore;
