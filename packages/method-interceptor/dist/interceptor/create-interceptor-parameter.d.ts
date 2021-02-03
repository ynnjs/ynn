/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptor/create-interceptor-parameter.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/05/2021
 * Description:
 ******************************************************************/
declare function createInterceptorParameter<T extends unknown[]>(obj: object, // eslint-disable-line
methodName: string): (...args: T) => Promise<unknown[]>;
export default createInterceptorParameter;
