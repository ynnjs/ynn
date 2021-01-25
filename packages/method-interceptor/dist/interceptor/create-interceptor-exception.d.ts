/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-exception.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/28/2020
 * Description:
 ******************************************************************/
import { InterceptorException, Methods, MethodException } from './interceptor.interface';
declare function createInterceptorException<T extends unknown[]>(descriptor: Readonly<PropertyDescriptor>, methods?: Readonly<Methods<MethodException<T>>>): InterceptorException<T>;
export default createInterceptorException;
