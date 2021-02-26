/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/method.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/26/2021
 * Description:
 ******************************************************************/
import { MetadataBefore, MetadataAfter, MetadataException, MixedMetadataParameter } from './metadata';
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
export interface MethodAfter<T extends unknown[]> {
    /**
     * @param metadata - {@link MetadataAfter}
     * @param value - the return value of the target method or the intercetpor method before the current one
     * @param ...args - other arguments
     */
    (metadata: Readonly<MetadataAfter>, value: unknown, ...args: T): unknown;
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
    (metadata: Readonly<MixedMetadataParameter>, ...args: [...T, unknown?]): unknown;
}
export declare type Methods<T> = Record<string | number | symbol, T>;
export interface MethodInfo<T, M> {
    /**
     * the method could be undefined in the type of interceptor is not set.
     */
    method: M;
    metadata: T;
}
export interface MethodParameterInfo<M> {
    metadata: MixedMetadataParameter;
    method?: M;
}
