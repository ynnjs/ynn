/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/interceptor.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/20/2020
 * Description:
 ******************************************************************/
import { MetadataBefore, MetadataAfter, MetadataException, MetadataParameter } from '../metadata.interface';
/**
 * The interface of methods that will be called by `InterceptorBefore`.
 * Each method should return a Promise object that resolves with anything, and the resolved value will not be used for calling the target method.
 */
export interface MethodBefore<T extends unknown[]> {
    /**
     * @param metadaat - {@link MetadataBefore}
     * @param ...args - other arguments for the method
     */
    (metadata: Readonly<MetadataBefore>, ...args: T): unknown;
}
/**
 * The interface of methods the will be called by `InterceptorAfter`.
 *
 */
export interface MethodAfter<V, T extends unknown[]> {
    /**
     * @param value - the return value of the target method.
     * @param metadata - {@link MetadataAfter}
     * @param ...args - other arguments
     */
    (metadata: Readonly<MetadataAfter>, value: V, ...args: T): unknown;
}
/**
 * the interface of methods for catch exceptions for interceptors.
 */
export interface MethodException<T extends unknown[]> {
    /**
     * the method that will be called by `InterceptorException`, the method should return a Promise object.
     * if the Promise object resolved, the value will be treated as the new return value of the target method, otherwise, the new reject error will be thrown out.
     *
     * @param e - the thrown error object
     * @param metadata - {@link MethodException}
     * @param ...args - other arguments
     *
     * @return a Promise object.
     */
    (metadata: Readonly<MetadataException>, e: unknown, ...args: T): unknown;
}
export interface MethodParameter<T extends unknown[]> {
    /**
     * @param metadata - {@link MethodParameter}
     * @param ...args - other arguments
     */
    (metadata: Readonly<MetadataParameter>, ...args: T): Promise<unknown>;
}
export declare type Methods<T> = Record<string | number | symbol, T>;
export interface MethodInfo<T, M> {
    /**
     * the method could be undefined in the type of interceptor is not set.
     */
    method: M;
    metadata: T;
}
/**
 * The declaration of InterceptorBefore method.
 *
 * @paramtype T - Type of the arguments which will be passed to the generated methods.
 *
 * @example
 *
 * ```ts
 * ( ctx: KoaContext ) => Promise.all( [
 *     fn1( ctx ),
 *     fn2( ctx )
 * ] );
 * ```
 */
export interface InterceptorBefore<T extends unknown[]> {
    (...args: T): Promise<unknown>;
}
export interface InterceptorAfter<V, T extends unknown[]> {
    (value: V, ...args: T): Promise<unknown>;
}
export interface InterceptorException<T extends unknown[]> {
    (e: unknown, ...args: T): unknown;
}
export interface InterceptorParameter<T extends unknown[]> {
    (...args: T): Promise<unknown[]>;
}
