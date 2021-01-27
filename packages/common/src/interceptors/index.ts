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

import {
    MethodInterceptorMetadata,
    ParameterInterceptorMetadata
} from '../interfaces/metadata.interface';

export interface Interceptors<T extends any[]> {
    before: ( ...args: T ) => void;
    after: ( value: any, ...args: T ) => any;
    parameters: any[];
    exception: ( ...args: any[] ) => any;
}

export interface GenerateInterceptorOptions {
    beforeMethods: Record<string, any>;
    afterMethods: Record<string, any>;
    parameterMethods: Record<string, any>;
    exceptionMethods: Record<string, any>;
}

export default function generateInterceptorMethods<T extends any[]>(
    constructor,
    descriptor,
    methodName,
    options?: GenerateInterceptorOptions
): Interceptors<T> {

    function extract<T = MethodInterceptorMetadata>(
        key: string | symbol,
        methods: Record<string, any>
    ): any[] {
        const boundMethods = [];

        Reflect.getMetadata( key, descriptor.value ).forEach( ( metadata: T ) => {
            boundMethods.push( { method : methods[ metadata.type ], metadata } );
        } );

        return boundMethods;
    }


    const { beforeMethods, afterMethods, parameterMethods, exceptionMethods } = options || {};

    /**
     * extract all interceptors' information from metadata.
     */
    const boundBeforeMethods = extract( INTERCEPTOR_BEFORE_KEY, beforeMethods );
    const boundAfterMethods = extract( INTERCEPTOR_AFTER_KEY, afterMethods );
    const boundExceptionMethods = extract( INTERCEPTOR_EXCEPTION_KEY, exceptionMethods );

    const boundParameterMethods = [];

    Reflect.getMetadata( INTERCEPTOR_PARAMETER_KEY, constructor, methodName ).forEach( ( metadata: ParameterInterceptorMetadata ) => {
        boundParameterMethods.push( {
            method : parameterMethods[ metadata.type ],
            metadata
        } );
    } );

    const before = async ( ...args: T ): Promise<any> => {
        const promises = [];
        boundBeforeMethods.forEach( ( interceptor ) => {
            promises.push( interceptor.method( interceptor.metadata, ...args ) );
        } );

        return Promise.all( promises );
    };

    const after = ( value: any, ...args: T ): any => {
        boundAfterMethods.forEach( ( interceptor ) => {
        } );
    };

    return { before, after, parameters, exception };
}
