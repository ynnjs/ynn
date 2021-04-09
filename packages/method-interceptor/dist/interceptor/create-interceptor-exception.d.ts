/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-exception.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/28/2020
 * Description:
 ******************************************************************/
import { GlobalFunction } from '@ynn/utility-types';
export interface InterceptorException<T extends unknown[] = unknown[]> {
    ( e: unknown, ...args: T ): Promise<unknown>;
}
export declare function createInterceptorException<T extends unknown[] = unknown[]>( descriptorOrConstructor: Readonly<PropertyDescriptor> | GlobalFunction ): InterceptorException<T>;
