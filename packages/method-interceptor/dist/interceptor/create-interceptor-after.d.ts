/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-after.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/27/2020
 * Description:
 ******************************************************************/
/**
 * @typeparam T
 * @typeparam V
 *
 * @returns
 */
declare function createInterceptorAfter<V = unknown, T extends unknown[] = unknown[]>(descriptor: Readonly<PropertyDescriptor>): (value: V, ...args: T) => Promise<unknown>;
export default createInterceptorAfter;
