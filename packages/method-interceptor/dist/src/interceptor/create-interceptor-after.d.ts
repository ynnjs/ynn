/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-after.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/27/2020
 * Description:
 ******************************************************************/
import { InterceptorAfter, Methods } from './interceptor.interface';
declare function createInterceptorAfter<T>(descriptor: PropertyDescriptor): InterceptorAfter<T>;
declare function createInterceptorAfter<T>(descriptor: PropertyDescriptor, methods: Methods): InterceptorAfter<T>;
declare function createInterceptorAfter<T>(descriptor: PropertyDescriptor, methods: undefined): InterceptorAfter<T>;
export default createInterceptorAfter;
