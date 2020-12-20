/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/interceptor.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/20/2020
 * Description:
 ******************************************************************/

export interface InterceptorMethod {
    ( ...args: any[] ): any;
}

export type InterceptorMethodKey = string | symbol | number;

export type InterceptorMethodPool = Record<InterceptorMethodKey, InterceptorMethod>;

export interface InterceptorMethodInfo<T> {
    method: InterceptorMethod;
    metadata: T;
}
