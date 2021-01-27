/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-exception.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/28/2020
 * Description:
 ******************************************************************/
declare function createInterceptorException<T extends unknown[] = unknown[]>(descriptor: Readonly<PropertyDescriptor>): (e: unknown, ...args: T) => Promise<unknown>;
export default createInterceptorException;
