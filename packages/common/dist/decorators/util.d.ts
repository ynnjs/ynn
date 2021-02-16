/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/util.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/26/2020
 * Description:
 ******************************************************************/
import { Context } from '@ynn/waka';
import { VariadicFunction } from '@ynn/utility-types';
import { Pipe } from '../interfaces';
/**
 * Save metadata for request method decorator and class decorator
 *
 * @param constructorOrDescriptor - the constructor for class decorator or descriptor for method decorator
 * @param interceptor - interceptor function
 * @param parameters
 */
export declare function saveRequestDecoratorMetadata(constructorOrDescriptor: Function | Readonly<PropertyDescriptor>, // eslint-disable-line
interceptor: VariadicFunction, parameters?: unknown): void;
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
export declare function saveResponseDecoratorMetadata(constructorOrDescriptor: Function | Readonly<PropertyDescriptor>, // eslint-disable-line
interceptor: VariadicFunction, parameters?: unknown): void;
export declare function saveExceptionDecoratorMetadata(constructorOrDescriptor: Function | Readonly<PropertyDescriptor>, // eslint-disable-line
interceptor: VariadicFunction, parameters?: unknown): void;
export declare function saveParameterDecoratorMetadata(target: object, // eslint-disable-line
key: string | symbol, index: number, interceptor: VariadicFunction, parameters?: unknown): void;
export declare function createRequestDecorator(interceptor: VariadicFunction, parameters?: unknown): MethodDecorator & ClassDecorator;
export declare function createResponseDecorator(interceptor: VariadicFunction, parameters?: unknown): MethodDecorator & ClassDecorator;
export declare function createExceptionDecorator(interceptor: VariadicFunction, parameters?: unknown): MethodDecorator & ClassDecorator;
export declare function createParameterDecorator(interceptor: VariadicFunction, parameters?: unknown): ParameterDecorator;
export interface CreateDecoratorOptions {
    requestInterceptor?: VariadicFunction;
    responseInterceptor?: VariadicFunction;
    parameterInterceptor?: VariadicFunction;
    exceptionInterceptor?: VariadicFunction;
    parameters?: unknown;
}
export declare function createDecorator(options: CreateDecoratorOptions): ClassDecorator & MethodDecorator & ParameterDecorator;
export interface CreateGeneralDecoratorOptions {
    parameterInterceptor?: VariadicFunction;
    requestInterceptor?: VariadicFunction;
    exceptionInterceptor?: VariadicFunction;
    responseInterceptor?: VariadicFunction;
}
export declare function createGeneralDecorator(options: Readonly<CreateGeneralDecoratorOptions>, propertyOrPipe?: string | Pipe, ...pipes: Pipe[]): MethodDecorator & ParameterDecorator;
export declare function executePipes(pipes: Pipe[], value: unknown, ctx: Context): Promise<unknown>;
