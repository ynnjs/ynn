/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptor/extract-methods.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/23/2021
 * Description:
 ******************************************************************/
import { VariadicFunction } from '@ynn/utility-types';
import { Metadata } from '../metadata.interface';
import { Methods, MethodInfo } from './interceptor.interface';
/**
 * extract all interceptor methods of a descriptor with specific key from a method pool.
 *
 * @param key - the key for metadata
 * @param descriptor - the target descriptor of the class instance method.
 * @param methods - the method pool that provides interceptor methods.
 *
 * @returns a list of information of extracted methods
 */
export default function extractMethods<T extends Methods<VariadicFunction>>(key: string | number | symbol, descriptor: Readonly<PropertyDescriptor>, methods: Readonly<T>): MethodInfo<Metadata, T[keyof T]>[];
