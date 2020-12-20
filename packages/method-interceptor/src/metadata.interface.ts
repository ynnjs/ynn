/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/metadata.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/20/2020
 * Description:
 ******************************************************************/

type Parameters = Record<string, any>;

/**
 * the base metadata interface for Interceptor
 *
 * @typeparam T - Type of the parameters
 */
export interface InterceptorMetadata<T = any> {
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
    parameters: T;
}

/**
 * metadata for class instance methods
 *
 * @typeparam T - Type of the parameters
 *
 * @example
 *
 * ```ts
 * const metadata: MethodInterceptorMetadata<{
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
export interface MethodInterceptorMetadata<T extends Parameters> extends InterceptorMetadata<T> {
    interceptorType: 'before' | 'after';
}

/**
 * metadata for exception interceptor of classes or class instance methods.
 *
 * @typeparam T - Type of the parameters
 *
 * @example
 *
 * ```ts
 * const metadata: ExceptionInterceptorMetadata<{
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
export interface ExceptionInterceptorMetadata<T extends Parameters> extends InterceptorMetadata<T> {
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
 * @typeparam T - Type of the parameters
 *
 * @example
 * ```ts
 * const metadata: ParameterInterceptorMetadata<{
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
export interface ParameterInterceptorMetadata<T extends Parameters> extends InterceptorMetadata<T> {
    interceptorType: 'parameter';
    /**
     * the metadata type of the parameter.
     */
    metadataType: unknown;
}
