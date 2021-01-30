/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: metadata/metadata.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/30/2021
 * Description:
 ******************************************************************/
import { VariadicClass } from '@ynn/utility-types';
/**
 * the base metadata interface for Interceptor
 */
export interface Metadata {
    /**
     * the type of the interceptor method,
     * it should be defined in decorators and used to find out which interceptor method should be used.
     *
     * for example, the type named *auth* may be associated with a method for authorization in `before` intercetpors.
     *
     * @todo `unique symbol` is not allowed to be used as an index type in the current version of typescript.
     * It seems will be added in 4.2, so I wouldn't like to try using some tricky way to make it pass the type checking rather than added the `symbol` type back after 4.2.x releasing.
     * {@link https://github.com/microsoft/TypeScript/issues/41601 | TypeScript 4.2 Iteration Plan}
     * {@link https://github.com/microsoft/TypeScript/pull/26797 | Allow any key type as an index signature parameter type}
     * {@link https://www.staging-typescript.org/play?ts=4.2.0-pr-26797-45#code/MYewdgzgLgBBMF4YGUCeBbARiANgChgHIAPQmASgG4Aoa0SWEALhgCUBTUAJwBMAeANbtUIAGYwAhmFQAaSdIB8iGAG8AvrWogA2nBgBdZQEZKQA | Playground}
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
    parameters?: unknown;
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
export interface MetadataBefore extends Metadata {
    interceptorType: 'before';
}
export interface MetadataAfter extends Metadata {
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
export interface MetadataException extends Metadata {
    interceptorType: 'exception';
    /**
     * the type should be a constructor or undefined.
     * using `undefined` means the interceptor can handle all types of Error object.
     */
    exceptionType?: VariadicClass;
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
export declare type MetadataParameter = Partial<Metadata> & {
    paramtype: unknown;
};
