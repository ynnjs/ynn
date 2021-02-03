/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: metadata/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/30/2021
 * Description:
 ******************************************************************/
import { MetadataBefore, MetadataAfter, MetadataException, MetadataParameter } from './metadata.interface';
import { MethodBefore, MethodAfter, MethodException, MethodParameter } from '../method.interface';
export * from './metadata.interface';
/**
 * save metadata for interceptor before.
 *
 * @param descriptor
 * @param method
 * @param options
 */
export declare function saveMetadataBefore<T extends unknown[]>(descriptor: PropertyDescriptor, method: MethodBefore<T>, options?: Readonly<Pick<MetadataBefore, 'parameters'>>): void;
/**
 * save metadata for interceptor after
 *
 * @param descriptor
 * @param method
 * @param options
 */
export declare function saveMetadataAfter<T extends unknown[]>(descriptor: PropertyDescriptor, method: MethodAfter<T>, options?: Pick<MetadataAfter, 'parameters'>): void;
/**
 * save metadata for interceptor exception
 *
 * @param descriptor
 * @param method
 * @param options
 */
export declare function saveMetadataException<T extends unknown[]>(descriptor: PropertyDescriptor, method: MethodException<T>, options?: Pick<MetadataException, 'exceptionType' | 'parameters'>): void;
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
key: string | symbol, i: number, method: MethodParameter<T>, options?: Readonly<Pick<MetadataParameter, 'parameters'>>): void;
