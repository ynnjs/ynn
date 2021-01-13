/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-after.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/27/2020
 * Description:
 ******************************************************************/
import { InterceptorAfter, Methods, MethodAfter } from './interceptor.interface';
declare function createInterceptorAfter<T extends unknown[], V = unknown>(descriptor: Readonly<PropertyDescriptor>, methods?: Methods<MethodAfter<T>> | undefined): InterceptorAfter<T, V>;
export default createInterceptorAfter;
