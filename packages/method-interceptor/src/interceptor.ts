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

export interface CreateInterceptorOptions {
    beforeMethods?: InterceptorMethodPoll;
    afterMethods?: InterceptorMethodPoll;
    parameterMethods?: InterceptorMethodPoll;
    exceptionMethods?: InterceptorMethodPoll;
}

export interface CreatedInterceptorMethods<T extends any[]> {
    before: InterceptorBefore<T>;
    after: InterceptorAfter<T>;
    exception: InterceptorException<T>;
    parameters: InterceptorParameters<T>;
}

export function createInterceptorMethodBefore<T>( descriptor: TypedPropertyDescriptor<any>, methods: InterceptorMethodPoll | undefined ): InterceptorBefore<T> {

    type Info = InterceptorMethodInfo<MethodInterceptorMetadata>;

    if( !methods ) return () => Promise.resolve();

    const bound: Info[] = extract( KEY_BEFORE, descriptor, methods );

    return ( ...args ) => {
        const promises = [];
        bound.forEach( ( info : Info ) => {
            promises.push( info.method( info.metadata, ...args ) );
        } );
        return Promise.all( promises );
    }
}

export function createInterceptorMethodAfter<T>( descriptor: TypedPropertyDescriptor<any>, methods: InterceptorMethodPoll | undefined ): InterceptorAfter<T> {

    if( !methods ) return value => Promise.resolve( value );

    const bound = extract( KEY_AFTER, descriptor, methods );

    return async ( value, ...args ) => {
        let res = value;
        for( const info of bound ) {
            res = await info.method( res, info.metadata, ...args ); 
        }
        return res;
    }
}

export function createInterceptorMethodException<T>( descriptor: TypedPropertyDescriptor<any>, methods: InterceptorMethodPoll | undefined ): InterceptorException<T> {

    /**
     * the exception interceptor would throw the given Error as default.
     */
    if( !methods ) return ( e: any ): any => { throw e };

    const bound = extract<ExceptionInterceptorMetadata>( KEY_EXCEPTION, descriptor, methods );

    return ( e: any, ...args ): any => {
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

export function createInterceptorMethodParameters<T>( constructor, methodName, methods ): InterceptorParameters<T> {

    type Info = InterceptorMethodInfo<ParameterInterceptorMetadata>;
    const bound: Info[] = [];

    const metadatas: ParameterInterceptorMetadata[] = Reflect.getMetadata( KEY_PARAMETER, constructor.prototype, methodName );

    Reflect.getMetadata( 'design:paramtypes', constructor.prorotype, methodName ).forEach( ( paramtype: unknown, i: number ) => {

        const metadata = metadatas[ i ];
        metadata.paramtype = paramtype;

        bound.push( {
            method : methods[ metadata.type ],
            metadata : {
                ...( metadatas[ i ] || {} ),
                paramtype
            }
        } );
    } );

    return () => {};
}

/**
 * create all interceptor methods using given information.
 *
 * @typeparam T - The type of arguments that will be passed to each interceptor method whill calling it.
 *
 * @param constructor - The constructor
 * @param descriptor - The descriptor which want to be called
 * @param methodName - The name of the method, it's used for generating `parameters interceptor method`.
 * @param options - The options that conforms `CreatedInterceptorMethods<T>`;
 *
 * @returns The object with all type of interceptor methods.
 */
export function createInterceptorMethods<T>(
    constructor: new ( ...args: any[] ) => any,
    descriptor: TypedPropertyDescriptor<any>,
    methodName: string,
    options?: CreateInterceptorOptions
): CreatedInterceptorMethods<T> {

    const before = createInterceptorMethodBefore<T>( descriptor, options.beforeMethods );
    const after = createInterceptorMethodAfter<T>( descriptor, options.afterMethods );
    const exception = createInterceptorMethodException<T>( descriptor, options.exceptionMethods );
    const parameters = createInterceptorMethodParameters<T>( constructor, methodName, options.parameterMethods );

    return { before, after, exception, parameters };
}
