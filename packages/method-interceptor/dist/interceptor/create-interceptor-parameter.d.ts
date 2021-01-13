/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptor/create-interceptor-parameter.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/05/2021
 * Description:
 ******************************************************************/
import { VariadicClass } from '@ynn/utility-types';
import { InterceptorParameter, Methods } from './interceptor.interface';
declare function createInterceptorParameter<T>(constructor: VariadicClass, methodName: string, methods?: Methods | undefined): InterceptorParameter<T>;
export default createInterceptorParameter;
