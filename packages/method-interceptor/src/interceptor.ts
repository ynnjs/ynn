/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/interceptor.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/20/2020
 * Description:
 ******************************************************************/

import 'reflect-metadata';

import extract from './extract-interceptor-method';
import { KEY_BEFORE, KEY_AFTER, KEY_PARAMETER, KEY_EXCEPTION } from './constant';
import { MethodInterceptorMetadata, ParameterInterceptorMetadata, ExceptionInterceptorMetadata } from './metadata.interface';
import { InterceptorBefore, InterceptorAfter, InterceptorException, InterceptorParameters, InterceptorMethodInfo, InterceptorMethodPoll } from './interceptor.interface';

export interface GenerateInterceptorOptions {
    beforeMethods?: InterceptorMethodPoll;
    afterMethods?: InterceptorMethodPoll;
    parameterMethods?: InterceptorMethodPoll;
    exceptionMethods?: InterceptorMethodPoll;
}

export interface GeneratedInterceptorMethods<T extends any[]> {
    before: InterceptorBefore<T>;
    after: InterceptorAfter<T>;
    exception: InterceptorException<T>;
    parameters: InterceptorParameters<T>;
}

/**
 * generate all interceptor methods using given information.
 *
 * @typeparam T - The type of arguments that will be passed to each interceptor method whill calling it.
 *
 * @param constructor - The constructor
 * @param descriptor - The descriptor which want to be called
 * @param methodName - The name of the method, it's used for generating `parameters interceptor method`.
 * @param options - The options that conforms `GeneratedInterceptorMethods<T>`;
 *
 * @returns The object with all type of interceptor methods.
 */
export function generateInterceptorMethods<T>(
    constructor: new ( ...args: any[] ) => any,
    descriptor: TypedPropertyDescriptor<any>,
    methodName: string,
    options?: GenerateInterceptorOptions
): GeneratedInterceptorMethods<T> {

    type Methods = GeneratedInterceptorMethods<T>;

    let before: Methods[ 'before' ] = () => {};

    if( options?.beforeMethods ) {
        type Info = InterceptorMethodInfo<MethodInterceptorMetadata>;
        const bound: Info[] = extract( KEY_BEFORE, descriptor, options.beforeMethods );

        before = ( ...args ) => {
            const promises = [];
            bound.forEach( ( info : Info ) => {
                promises.push( info.method( info.metadata, ...args ) );
            } );
            return Promise.all( promises );
        }
    }

    /**
     * generate the interceptor method which should be called after calling the class instance method.
     */
    let after: Methods[ 'after' ] = value => Promise.resolve( value );

    if( options?.afterMethods ) {
        type Info = InterceptorMethodInfo<MethodInterceptorMetadata>;
        const bound: Info[] = extract( KEY_AFTER, descriptor, options.afterMethods );

        after = async ( value, ...args ) => {
            let res = value;
            for( const info of bound ) {
                res = await info.method( res, info.metadata, ...args ); 
            }
            return res;
        }
    }

    /**
     * the exception interceptor would throw the given Error as default.
     */
    let exception: Methods[ 'exception' ] = ( e: any ): any => { throw e };

    if( options?.exceptionMethods ) {
        type Info = InterceptorMethodInfo<ExceptionInterceptorMetadata>;
        const bound: Info[] = extract<ExceptionInterceptorMetadata>( KEY_EXCEPTION, descriptor, options.exceptionMethods );

        exception = ( e: any, ...args ): any => {
            /**
             * find out the first exception interceptor method which can handle the error.
             */
            for( const info of bound ) {
                if( info.metadata.exceptionType === undefined || e instanceof info.metadata.type ) {
                    /**
                     * return the value if the handler doesn't throw another exception.
                     */
                    return info.method( e, ...args );
                }
            }
            throw e;
        }
    }

    let parameters: Methods[ 'parameters' ] = () => [];

    if( options?.parameterMethods ) {
        type Info = InterceptorMethodInfo<ParameterInterceptorMetadata>;
        const bound: Info[] = [];

        Reflect.getMetadata( KEY_PARAMETER, constructor, methodName ).forEach( ( metadata: ParameterInterceptorMetadata ) => {
            bound.push( {
                method : options.parameterMethods[ metadata.type ],
                metadata
            } );
        } );
    }

    return { before, after, parameters, exception};
}
