/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-exception.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/28/2020
 * Description:
 ******************************************************************/
import { InterceptorException, Methods } from './interceptor.interface';
declare function createInterceptorException<T>(descriptor: PropertyDescriptor): InterceptorException<T>;
declare function createInterceptorException<T>(descriptor: PropertyDescriptor, methods: undefined): InterceptorException<T>;
declare function createInterceptorException<T>(descriptor: PropertyDescriptor, methods: Methods): InterceptorException<T>;
export default createInterceptorException;
