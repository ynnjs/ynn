/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-before.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/26/2020
 * Description:
 ******************************************************************/
import { InterceptorBefore } from './interceptor.interface';
/**
 * create an empty interceptor method with methods is undefined.
 *
 * @typeparam T - the type of the arguments that will passed to the generated interceptor methods.
 *
 * @returns a `Promise` object that resolves nothing.
 */
declare function createInterceptorBefore<T extends unknown[] = unknown[]>(descriptor: Readonly<PropertyDescriptor>): InterceptorBefore<T>;
export default createInterceptorBefore;
