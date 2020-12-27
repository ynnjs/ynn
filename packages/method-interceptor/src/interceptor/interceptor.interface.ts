/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/interceptor.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/20/2020
 * Description:
 ******************************************************************/

import { BeforeMetadata, AfterMetadata, ExceptionMetadata, ParameterMetadata } from './metadata.interface';

export interface Method {
    ( ...args: any[] ): any;
}

export type Methods = Record<keyof any, Method>;

export interface MethodInfo<T> {
    /**
     * the method could be undefined in the type of interceptor is not set.
     */
    method: Method | undefined;
    metadata: T;
}

export interface InterceptorBefore<T> {
    ( metadata: BeforeMetadata, ...args: T ): Promise<any>;
}

export interface InterceptorAfter<T> {
    ( value: any, metadata: AfterMetadata, ...args: T ): Promise<any>;
}

export interface InterceptorException<T> {
    ( e: any, metadata: ExceptionMetadata, ...args: T ): any;
}

export interface InterceptorParameters<T> {
    ( ...args: T ): Promise<any[]>;
}
