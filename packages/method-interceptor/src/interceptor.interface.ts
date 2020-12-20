/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/interceptor.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/20/2020
 * Description:
 ******************************************************************/

import { MethodInterceptorMetadata } from './metadata.interface';

export interface InterceptorMethod {
    ( ...args: any[] ): any;
}

export type InterceptorMethodKey = string | symbol | number;

export type InterceptorMethodPool = Record<InterceptorMethodKey, InterceptorMethod>;

export interface InterceptorMethodInfo<T> {
    method: InterceptorMethod;
    metadata: T;
}

export interface InterceptorBefore<T> {
    ( metadata: MethodInterceptorMetadata, ...args: T ): any;
}

export interface InterceptorAfter<T> {
    ( value: any, metadata: MethodInterceptorMetadata, ...args: T ): Promise<any>;
}

export interface InterceptorException<T> {
    ( e: any, metadata: MethodInterceptorMetadata, ...args: T ): any;
}

export interface InterceptorParameters<T> {
    ( ...args: T ): Promise<any[]>;
}
