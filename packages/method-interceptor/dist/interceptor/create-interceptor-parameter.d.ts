/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptor/create-interceptor-parameter.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/05/2021
 * Description:
 ******************************************************************/
import { VariadicObject } from '@ynn/utility-types';
declare function createInterceptorParameter<T extends unknown[]>(...args: [
    obj: VariadicObject,
    methodName?: string | symbol
]): (...args: T) => Promise<unknown[]>;
export default createInterceptorParameter;
