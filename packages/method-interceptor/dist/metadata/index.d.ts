/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: metadata/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/30/2021
 * Description:
 ******************************************************************/
import { GlobalFunction, VariadicObject } from '@ynn/utility-types';
import { MetadataBefore, MetadataAfter, MetadataException, MetadataParameter, MetadataFinally } from './metadata.interface';
import { MethodBefore, MethodAfter, MethodException, MethodParameter, MethodFinally } from '../method.interface';
export * from './metadata.interface';
/**
 * save metadata for interceptor before.
 *
 * @param descriptor
 * @param method
 * @param options
 */
export declare function saveMetadataBefore<T extends unknown[]>( descriptor: PropertyDescriptor | GlobalFunction, method: MethodBefore<T>, options?: Readonly<Pick<MetadataBefore, 'parameters'>> ): void;
export declare function getMetadataBefore( descriptorOrConstructor: PropertyDescriptor | GlobalFunction ): ( MetadataBefore | undefined )[];
/**
 * save metadata for interceptor after
 *
 * @param descriptor
 * @param method
 * @param options
 */
export declare function saveMetadataAfter<T extends unknown[]>( descriptor: PropertyDescriptor | GlobalFunction, method: MethodAfter<T>, options?: Pick<MetadataAfter, 'parameters'> ): void;
export declare function getMetadataAfter( descriptorOrConstructor: PropertyDescriptor | GlobalFunction ): ( MetadataAfter | undefined )[];
/**
 * save metadata for interceptor exception
 *
 * @param descriptor
 * @param method
 * @param options
 */
export declare function saveMetadataException<T extends unknown[]>( descriptorOrConstructor: PropertyDescriptor | GlobalFunction, method: MethodException<T>, options?: Pick<MetadataException, 'exceptionType' | 'parameters'> ): void;
export declare function getMetadataException( descriptorOrConstructor: PropertyDescriptor | GlobalFunction ): ( MetadataException | undefined )[];
/**
 * save metadata for interceptor finally
 *
 * @param descriptorOrConstructor
 */
export declare function saveMetadataFinally<T extends unknown[]>( descriptorOrConstructor: PropertyDescriptor | GlobalFunction, method: MethodFinally<T>, options?: Pick<MetadataFinally, 'parameters'> ): void;
export declare function getMetadataFinally( descriptorOrConstructor: PropertyDescriptor | GlobalFunction ): ( MetadataFinally | undefined )[];
/**
 * save metadata for interceptor parameter
 *
 * @param target
 * @param key
 * @param i
 * @param method
 * @param options
 */
export declare function saveMetadataParameter<T extends unknown[]>(target: object, // eslint-disable-line
key: string | symbol, i: number, method: MethodParameter<T>, options?: Readonly<Pick<MetadataParameter, 'parameters'>> ): void;
export declare function getMetadataParameter( ...args: [
    target: VariadicObject,
    key?: string | symbol
] ): ( MetadataParameter | undefined )[];
