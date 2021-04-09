/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptor/extract-methods.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/23/2021
 * Description:
 ******************************************************************/
import { VariadicFunction, GlobalFunction } from '@ynn/utility-types';
import { MetadataBefore, MetadataAfter, MetadataException, MetadataFinally } from '../metadata';
import { MethodInfo } from '../method.interface';
declare type Metadata = MetadataBefore | MetadataAfter | MetadataException | MetadataFinally;
/**
 * extract all interceptor methods of a descriptor with specific key from a method pool.
 *
 * @param key - the key for metadata
 * @param descriptorOrConstructor - the target descriptor of the class instance method.
 *
 * @returns a list of information of extracted methods
 */
export default function extractMethods( key: string | number | symbol, descriptorOrConstructor: Readonly<PropertyDescriptor> | GlobalFunction ): MethodInfo<Metadata, VariadicFunction>[];
export {};
