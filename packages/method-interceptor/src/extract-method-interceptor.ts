/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/extract-method-interceptor.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/20/2020
 * Description:
 ******************************************************************/

import { MethodInterceptorMetadata } from './metadata.interface';
import {
    InterceptorMethodKey,
    InterceptorMethodPoll,
    InterceptorMethodInfo
} from './interceptor.interface';

/**
 * extract all interceptor methods of a descriptor with specific key from a method pool.
 *
 * @typeparam T - the tyep of meadata
 *
 * @param key - the key for metadata
 * @param methods - the method pool that provides interceptor methods.
 * @param descriptor - the target descriptor of the class instance method.
 *
 * @returns a list of extracted methods' information.
 */
export default function extractMethodInterceptor<T = MethodInterceptorMetadata>(
    key: InterceptorMethodKey,
    methods: InterceptorMethodPoll,
    descriptor: TypedPropertyDescriptor<any>
): InterceptorMethodInfo<T>[] {

    const boundMethods = [];

    Reflect.getMetadata( key, descriptor.value ).forEach( ( metadata: T ) => {
        boundMethods.push( { method : methods[ metadata.type ], metadata } );
    } );

    return boundMethods;
}
