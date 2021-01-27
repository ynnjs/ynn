/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/24/2020
 * Description:
 ******************************************************************/
import createInterceptorBefore from './create-interceptor-before';
import createInterceptorAfter from './create-interceptor-after';
import createInterceptorException from './create-interceptor-exception';
import createInterceptorParameter from './create-interceptor-parameter';
export { createInterceptorBefore, createInterceptorAfter, createInterceptorException, createInterceptorParameter };
