/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-before.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/26/2020
 * Description:
 ******************************************************************/
import { GlobalFunction } from '@ynn/utility-types';
export interface InterceptorBefore<T extends unknown[] = unknown[]> {
    ( ...args: T ): Promise<unknown>;
}
/**
 * create an empty interceptor method with methods is undefined.
 *
 * @typeparam T - the type of the arguments that will passed to the generated interceptor methods.
 *
 * @param descriptorOrConstructor - the descriptor of class method or the constructor of the class
 *
 * @returns a `Promise` object that resolves nothing.
 */
export declare function createInterceptorBefore<T extends unknown[] = unknown[]>( descriptorOrConstructor: Readonly<PropertyDescriptor> | GlobalFunction ): InterceptorBefore<T>;
