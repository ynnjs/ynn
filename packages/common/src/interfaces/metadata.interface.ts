/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interfaces/metadata.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/02/2020
 * Description:
 ******************************************************************/

import Pipe from './pipe.interface';

type Property = string | symbol | number | undefined;

type InterceptorParameters = Record<string, any>;

/**
 * @example
 * ```ts
 * const metadata: MethodInterceptorMetadata<{
 *     property : string;
 * }> = {
 *     type : 'body',
 *     interceptorType : 'before',
 *     parameters : {
 *         property : 'id'
 *     }
 * }
 * ```
 */
export interface MethodInterceptorMetadata<T extends InterceptorParameters> {
    type: string | symbol | number;
    interceptorType: 'before' | 'after';
    parameters: T;
}

export interface ParameterInterceptorMetadata<T extends InterceptorParameters> {
    type: string | symbol | number;
    interceptorType: 'parameter';
    metadataType: unknown;
    parameters: T;
}

export type ActionInterceptorMetadata = MethodInterceptorMetadata<{
    property?: Property;
    pipe?: Pipe;
}>

export type ActionParameterInterceptorMetadata = ParameterInterceptorMetadata<{
    property?: Property;
    pipe?: Pipe;
}>;
