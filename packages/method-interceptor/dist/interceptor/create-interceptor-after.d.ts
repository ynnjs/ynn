/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-after.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/27/2020
 * Description:
 ******************************************************************/
import { InterceptorAfter, Methods, MethodAfter } from './interceptor.interface';
/**
 * @typeparam T
 * @typeparam V
 *
 * @returns
 */
declare function createInterceptorAfter<V = unknown, T extends unknown[] = unknown[]>(descriptor: Readonly<PropertyDescriptor>, methods?: Readonly<Methods<MethodAfter<T>>>): InterceptorAfter<V, T>;
export default createInterceptorAfter;
