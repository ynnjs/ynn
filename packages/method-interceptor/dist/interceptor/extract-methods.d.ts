/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptor/extract-methods.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/23/2021
 * Description:
 ******************************************************************/
import { VariadicFunction } from '@ynn/utility-types';
import { MetadataBefore, MetadataAfter, MetadataException } from '../metadata.interface';
import { MethodInfo } from '../method.interface';
declare type Metadata = MetadataBefore | MetadataAfter | MetadataException;
/**
 * extract all interceptor methods of a descriptor with specific key from a method pool.
 *
 * @param key - the key for metadata
 * @param descriptor - the target descriptor of the class instance method.
 *
 * @returns a list of information of extracted methods
 */
export default function extractMethods(key: string | number | symbol, descriptor: Readonly<PropertyDescriptor>): MethodInfo<Metadata, VariadicFunction>[];
export {};
