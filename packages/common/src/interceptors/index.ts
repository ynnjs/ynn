/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptors/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/16/2020
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import {
    INTERCEPTOR_BEFORE_KEY,
    INTERCEPTOR_AFTER_KEY,
    INTERCEPTOR_PARAMETER_KEY,
    INTERCEPTOR_EXCEPTION_KEY
} from '../constants';

export interface Interceptors<T extends any[]> {
    callBefore: ( ...args: T ) => void;
    callAfter: ( value: any, ...args: T ) => any;
    args: any[];
    onException: ( ...args: any[] ) => any;
}

export interface GenerateInterceptorOptions {
    beforeMethods: Record<string, any>;
    afterMethods: Record<string, any>;
    onException: Record<string, any>;
}

export default function generateInterceptor<T extends any[], E extends any[]>(
    constructor,
    descriptor,
    methodName,
    options: GenerateInterceptorOptions
): Interceptors<T> {

    Reflect.getMetadata( INTERCEPTOR_BEFORE_KEY, descriptor.value ).forEach( ( metadata ) => {
        const { type, property, pipe } = metadata;
    } );

    Reflect.getMetadata( INTERCEPTOR_PARAMETER_KEY, constructor, methodName );

    const before = ( ...args: T ) => {
    };

    const after = ( value: any, ...args: T ) => {
    };

    const param: any[] = [];

    const exception = ( ...args: E ) => {
    };

    return { before, after, params, exception }
}
