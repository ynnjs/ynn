/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: metadata/metadata.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/30/2021
 * Description:
 ******************************************************************/
import { GlobalFunction } from '@ynn/utility-types';
/**
 * the base metadata interface for Interceptor
 */
export interface Metadata<T = unknown> {
    /**
     * the type of the interceptor method,
     * it should be defined in decorators and used to find out which interceptor method should be used.
     *
     * for example, the type named *auth* may be associated with a method for authorization in `before` intercetpors.
     */
    type: string | number | symbol;
    /**
     * the type of the interceptor
     * such as before, after, parameter and exception, etc.
     */
    interceptorType: string;
    /**
     * the parameters which will be passed to interceptor methods.
     */
    parameters?: T;
}
/**
 * metadata for class instance methods
 *
 * @example
 *
 * ```ts
 * const metadata: MetadataBefore = {
 *     type : 'body',
 *     interceptorType : 'before',
 *     parameters : {
 *         property : 'id'
 *     }
 * }
 * ```
 */
export interface MetadataBefore<T = unknown> extends Metadata<T> {
    interceptorType: 'before';
}
export interface MetadataAfter<T = unknown> extends Metadata<T> {
    interceptorType: 'after';
}
/**
 * metadata for exception interceptor of classes or class instance methods.
 *
 * @typeparam P - Type of the parameters
 *
 * @example
 *
 * ```ts
 * const metadata: MatadataException = {
 *     type : TypeError,
 *     interceptorType : 'exception',
 *     parameters : {
 *         property : 'id'
 *     }
 * }
 * ```
 */
export interface MetadataException<T = unknown> extends Metadata<T> {
    interceptorType: 'exception';
    /**
     * the type should be a constructor or undefined.
     * using `undefined` means the interceptor can handle all types of Error object.
     */
    exceptionType?: GlobalFunction;
}
export interface MetadataFinally<T = unknown> extends Metadata<T> {
    interceptorType: 'finally';
}
/**
 * method for parameters of class instance methods
 *
 * @remarks
 *
 * the typescript's `emitDecoratorMetadata` option should be set to true if you wanna use this feature.
 * {@link https://www.typescriptlang.org/docs/handbook/decorators.html#metadata}
 *
 * @typeparam P - Type of the parameters
 *
 * @example
 * ```ts
 * const metadata: MetadataParameter = {
 *     type : 'body',
 *     interceptorType : 'parameter',
 *     metadataType : 'UserDto',
 *     parameter : {
 *         property : 'id'
 *     }
 * }
 * ```
 */
export interface MetadataParameter<T = unknown> extends Metadata<T> {
    interceptorType: 'parameter';
}
export declare type MixedMetadataParameter<T = unknown> = Partial<Metadata<T>> & {
    paramtype: unknown;
};
