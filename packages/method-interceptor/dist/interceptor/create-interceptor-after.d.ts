/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-after.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/27/2020
 * Description:
 ******************************************************************/
import { GlobalFunction } from '@ynn/utility-types';
export interface InterceptorAfter<T extends unknown[] = unknown[]> {
    ( value: unknown, ...args: T ): Promise<unknown>;
}
/**
 * @typeparam T
 *
 * @returns
 */
export declare function createInterceptorAfter<T extends unknown[] = unknown[]>( descriptorOrConstructor: Readonly<PropertyDescriptor> | GlobalFunction ): InterceptorAfter<T>;
