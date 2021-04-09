/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/util.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/26/2020
 * Description:
 ******************************************************************/

import { VariadicFunction, VariadicClass } from '@ynn/utility-types';
import { saveMetadataBefore, saveMetadataAfter, saveMetadataException, saveMetadataParameter } from '@ynn/method-interceptor';
import { Pipe } from '@ynn/core';

/**
 * Save metadata for request method decorator and class decorator
 *
 * @param constructorOrDescriptor - the constructor for class decorator or descriptor for method decorator
 * @param interceptor - interceptor function
 * @param parameters
 */
export function saveRequestDecoratorMetadata(
    constructorOrDescriptor: VariadicClass | Readonly<PropertyDescriptor>,
    interceptor: VariadicFunction,
    parameters?: unknown
): void {
    saveMetadataBefore( constructorOrDescriptor, interceptor, { parameters } );
}

/**
 * Save metadata for response method decorator and class decorator
 *
 * @example
 *
 * ```ts
 * ```
 *
 * @param constructorOrDescriptor - the constructor for class decorator or descriptor for method decorator
 * @param interceptor - interceptor function
 * @param parameters
 */
export function saveResponseDecoratorMetadata(
    constructorOrDescriptor: VariadicClass | Readonly<PropertyDescriptor>,
    interceptor: VariadicFunction,
    parameters?: unknown
): void {
    saveMetadataAfter( constructorOrDescriptor, interceptor, { parameters } );
}

export function saveExceptionDecoratorMetadata(
    constructorOrDescriptor: VariadicClass | Readonly<PropertyDescriptor>,
    interceptor: VariadicFunction,
    parameters?: unknown
): void {
    saveMetadataException( constructorOrDescriptor, interceptor, { parameters } );
}

export function saveParameterDecoratorMetadata(
    target: object, // eslint-disable-line
    key: string | symbol,
    index: number,
    interceptor: VariadicFunction,
    parameters?: unknown
): void {
    saveMetadataParameter( target, key, index, interceptor, { parameters } );
}

export function createRequestDecorator(
    interceptor: VariadicFunction,
    parameters?: unknown
): MethodDecorator & ClassDecorator {
    return (
        targetOrConstructor: any, // eslint-disable-line @typescript-eslint/no-explicit-any
        key?: string | symbol,
        descriptor?: Readonly<PropertyDescriptor>
    ): void => {
        if( descriptor ) saveRequestDecoratorMetadata( descriptor, interceptor, parameters );
    };
}

export function createResponseDecorator(
    interceptor: VariadicFunction,
    parameters?: unknown
): MethodDecorator & ClassDecorator {
    return (
        targetOrConstructor: any, // eslint-disable-line @typescript-eslint/no-explicit-any
        key?: string | symbol,
        descriptor?: Readonly<PropertyDescriptor>
    ): void => {
        if( descriptor ) saveResponseDecoratorMetadata( descriptor, interceptor, parameters );
    };
}

export function createExceptionDecorator( interceptor: VariadicFunction, parameters?: unknown ): MethodDecorator & ClassDecorator {
    return ( target, key?: string | symbol, descriptor?: Readonly<PropertyDescriptor> ): void => {
        if( descriptor ) {
            saveExceptionDecoratorMetadata( descriptor, interceptor, parameters );
        }
    };
}

export function createParameterDecorator( interceptor: VariadicFunction, parameters?: unknown ): ParameterDecorator {
    return ( target, key: string | symbol, index: number ): void => {
        saveParameterDecoratorMetadata( target, key, index, interceptor, parameters );
    };
}

export interface CreateDecoratorOptions {
    requestInterceptor?: VariadicFunction;
    responseInterceptor?: VariadicFunction;
    parameterInterceptor?: VariadicFunction;
    exceptionInterceptor?: VariadicFunction;
    parameters?: unknown;
}

export function createDecorator( options: CreateDecoratorOptions ): ClassDecorator & MethodDecorator & ParameterDecorator {
    return ( target, key?: string | symbol, indexOrDescriptor?: PropertyDescriptor | number ): void => {

        /**
         * Method decorators and parameter decorators have index/descriptor argument
         */
        if( indexOrDescriptor !== undefined ) {
            if( typeof indexOrDescriptor === 'number' ) {
                options.parameterInterceptor && saveParameterDecoratorMetadata( target, key as string, indexOrDescriptor, options.parameterInterceptor, options.parameters );
                return;
            }

            if( options.requestInterceptor ) {
                saveRequestDecoratorMetadata( indexOrDescriptor, options.requestInterceptor, options.parameters );
                return;
            }

            if( options.responseInterceptor ) {
                saveResponseDecoratorMetadata( indexOrDescriptor, options.responseInterceptor, options.parameters );
                return;
            }

            if( options.exceptionInterceptor ) {
                saveExceptionDecoratorMetadata( indexOrDescriptor, options.exceptionInterceptor, options.parameters );
                return;
            }
        }
    };
}

export interface CreateGeneralDecoratorOptions {
    parameterInterceptor?: VariadicFunction;
    requestInterceptor?: VariadicFunction;
    exceptionInterceptor?: VariadicFunction;
    responseInterceptor?: VariadicFunction;
}

export function createGeneralDecorator(
    options: Readonly<CreateGeneralDecoratorOptions>,
    propertyOrPipe?: string | Pipe,
    ...pipes: Pipe[]
): MethodDecorator & ParameterDecorator {

    const t1 = typeof propertyOrPipe;

    let property: string | undefined;

    /**
     * both property and pipe can be empty
     */
    if( t1 === 'string' ) property = propertyOrPipe as string;
    else if( t1 === 'function' ) pipes.unshift( propertyOrPipe as Pipe );

    const parameters: {
        property?: string | symbol | number;
        pipes: Pipe[];
    } = { pipes };

    property && ( parameters.property = property );

    return createDecorator( { ...options, parameters } );
}
