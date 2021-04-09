/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/create-abe-interceptors.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/03/2021
 * Description:
 ******************************************************************/

import { GlobalFunction } from '@ynn/utility-types';
import {
    createInterceptorAfter,
    createInterceptorBefore,
    createInterceptorException,
    InterceptorAfter,
    InterceptorBefore,
    InterceptorException
} from '@ynn/method-interceptor';
import { Context } from '../context';

/**
 * create after, before and exception interceptors
 */
export function createABEInterceptors<T extends unknown[] = [ Context ]>(
    descriptorOrConstructor: Readonly<PropertyDescriptor> | GlobalFunction
): [ InterceptorAfter<T>, InterceptorBefore<T>, InterceptorException<T> ] {
    return [
        createInterceptorAfter<T>( descriptorOrConstructor ),
        createInterceptorBefore<T>( descriptorOrConstructor ),
        createInterceptorException<T>( descriptorOrConstructor )
    ];
}
