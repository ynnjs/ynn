/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/extract.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/24/2020
 * Description:
 ******************************************************************/
import { VariadicClass, ParametersShift } from '@ynn/utility-types';
import { Metadata, MetadataBefore, MetadataAfter, MetadataParameter, MetadataException } from '../metadata.interface';
import { MethodParameter, Methods, MethodInfo } from './interceptor.interface';
/**
 * extract all interceptor methods of a descriptor with specific key from a method pool.
 *
 * @typeparam T - the type of meadata, it should be extended from Metadata interface
 * @typeparam M - the type of values for methods object.
 *
 * @param key - the key for metadata
 * @param descriptor - the target descriptor of the class instance method.
 * @param methods - the method pool that provides interceptor methods.
 *
 * @returns a list of information of extracted methods
 */
declare function extractMethods<T extends Metadata, M>(key: keyof Methods, descriptor: PropertyDescriptor, methods: Methods<M>): MethodInfo<T, M>[];
/**
 * extract the before interceptor
 *
 * @param descriptor - the target descriptor of the class instance method.
 * @param methods - the method pool that provides interceptor methods.
 *
 * @return a list of information of extracted methods for *BEFORE INTERCEPTOR*.
 */
declare function before(...args: ParametersShift<typeof extractMethods>): MethodInfo<MetadataBefore>[];
declare function after(...args: ParametersShift<typeof extractMethods>): MethodInfo<MetadataAfter>[];
declare function exception(...args: ParametersShift<typeof extractMethods>): MethodInfo<MetadataException>[];
declare function parameter(constructor: VariadicClass, methodName: string | symbol | number, methods: Methods): MethodInfo<Partial<MetadataParameter, MethodParameter>>[];
declare const _default: {
    before: typeof before;
    after: typeof after;
    exception: typeof exception;
    parameter: typeof parameter;
};
export default _default;
