/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptor/create-interceptor-finally.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/05/2021
 * Description:
 ******************************************************************/
import { GlobalFunction } from '@ynn/utility-types';
export interface InterceptorFinally<T extends unknown[] = unknown[]> {
    ( ...args: T ): Promise<unknown>;
}
/**
 * @typeparam T
 *
 * @param descriptorOrConstructor
 */
export declare function createInterceptorFinally<T extends unknown[] = unknown[]>( descriptorOrConstructor: Readonly<PropertyDescriptor> | GlobalFunction ): InterceptorFinally<T>;
