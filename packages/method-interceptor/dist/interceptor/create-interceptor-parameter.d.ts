/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptor/create-interceptor-parameter.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/05/2021
 * Description:
 ******************************************************************/
import { VariadicObject } from '@ynn/utility-types';
export interface InterceptorParameter<T extends unknown[] = unknown[]> {
    ( ...args: T ): Promise<unknown[]>;
}
export declare function createInterceptorParameter<T extends unknown[]>( ...args: [
    obj: VariadicObject,
    methodName?: string | symbol
] ): InterceptorParameter<T>;
