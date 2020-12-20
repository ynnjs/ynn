/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/20/2020
 * Description:
 ******************************************************************/

import 'reflect-metadata';

import { KEY_BEFORE, KEY_AFTER, KEY_PARAMETER, KEY_EXCEPTION } from './constant';
import { MethodInterceptorMetadata, ParameterInterceptorMetadata } from './metadata.interface';
import { InterceptorMethod, InterceptorMethodKey, InterceptorMethodPoll } from './interceptor.interface';

export interface GenerateInterceptorOptions {
    beforeMethods: InterceptorMethodPoll;
    afterMethods: InterceptorMethodPoll;
    parameterMethods: InterceptorMethodPoll;
    exceptionMethods: InterceptorMethodPoll;
}

export function generateInterceptorMethods(
    constructor: new ( ...args: any[] ) => any,
    descriptor: TypedPropertyDescriptor<any>,
    methodName: string,
    options?: GenerateInterceptorOptions
) {

}
