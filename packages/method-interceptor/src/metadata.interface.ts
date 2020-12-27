/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/metadata.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/20/2020
 * Description:
 ******************************************************************/

/**
 * the base metadata interface for Interceptor
 *
 * @typeparam T - Type of the parameters
 */
export interface Metadata<P = any> {
    /**
     * the type of the interceptor method,
     * it should be defined in decorators and used to find out which interceptor method should be used.
     *
     * for example, the type named *auth* may be associated with a method for authorization in `before` intercetpors.
     */
    type: string | symbol | number;

    /**
     * the type of the interceptor
     * such as before, after, parameter and exception, etc.
     */
    interceptorType: string;

    /**
     * the parameters which will be passed to interceptor methods.
     */
    parameters: P;
}

/**
 * metadata for class instance methods
 *
 * @typeparam P - Type of the parameters
 *
 * @example
 *
 * ```ts
 * const metadata: MetadataBefore<{
 *     property: string;
 * }> = {
 *     type : 'body',
 *     interceptorType : 'before',
 *     parameters : {
 *         property : 'id'
 *     }
 * }
 * ```
 */
export interface MetadataBefore<P> extends Metadata<P> {
    interceptorType: 'before';
}

export interface MetadataAfter<P> extends Metadata<P> {
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
 * const metadata: MatadataException<{
 *     property: string;
 * }> = {
 *     type : TypeError,
 *     interceptorType : 'exception',
 *     parameters : {
 *         property : 'id'
 *     }
 * }
 * ```
 */
export interface MetadataException<P> extends Metadata<P> {
    interceptorType: 'exception';
    /**
     * the type should be a constructor or undefined.
     * using `undefined` means the interceptor can handle all types of Error object.
     */
    exceptionType: ( new( ...args: any[] ) => any ) | undefined;
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
 * const metadata: MetadataParameter<{
 *     property: string;
 * }> = {
 *     type : 'body',
 *     interceptorType : 'parameter',
 *     metadataType : 'UserDto',
 *     parameter : {
 *         property : 'id'
 *     }
 * }
 * ```
 */
export interface MetadataParameter<P> extends Metadata<P> {
    interceptorType: 'parameter';
    /**
     * the metadata type of the parameter.
     */
    paramtype?: unknown;
}
