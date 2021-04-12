/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/create-abef-interceptors.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/11/2021
 * Description:
 ******************************************************************/

import { GlobalFunction } from '@ynn/utility-types';
import {
    createInterceptorAfter,
    createInterceptorBefore,
    createInterceptorException,
    createInterceptorFinally,
    InterceptorAfter,
    InterceptorBefore,
    InterceptorException,
    InterceptorFinally
} from '@ynn/method-interceptor';
import { Context } from '../context';

/**
 * create after, before and exception interceptors
 */
export function createABEFInterceptors<T extends unknown[] = [ Context ]>(
    descriptorOrConstructor: Readonly<PropertyDescriptor> | GlobalFunction
): [ InterceptorAfter<T>, InterceptorBefore<T>, InterceptorException<T>, InterceptorFinally<T> ] {
    return [
        createInterceptorAfter<T>( descriptorOrConstructor ),
        createInterceptorBefore<T>( descriptorOrConstructor ),
        createInterceptorException<T>( descriptorOrConstructor ),
        createInterceptorFinally<T>( descriptorOrConstructor )
    ];
}
