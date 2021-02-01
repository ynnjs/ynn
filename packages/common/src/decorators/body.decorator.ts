/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/body.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/16/2020
 * Description:
 ******************************************************************/

import { Pipe } from '../interfaces';
import { interceptorBeforeBody, interceptorParameterBody } from '../interceptors';
import { createGeneralBeforeAndParameterActionDecorator } from './util';

/**
 * Function for generating an action parameter decorator or a method decorator.
 * The request stream will be parsed and the entire `body` object will be extracted and be bound to ctx as ctx.body.
 * Populates the decorated parameter with the value of body while using this method to generate a parameter decorator.
 *
 * For example:
 *
 * ```typescript
 * @Body()
 * create() {}
 *
 * async create( @Body() account: CreateAccountDto ) {}
 * ```
 *
 * ```typescript
 * @Body( validationFunction );
 * create() {}
 *
 * async create( @Body( validationFunction ) account: Record<string, any> ) {}
 *
 * async create( @Body( validationFunction ) account: CreateAccountDto ) {}
 * ```
 *
 * @param pipe function for data transformation or validation.
 *
 * @returns the parameter decorator or the method decorator.
 */
export function Body( pips?: Pipe ): ParameterDecorator & MethodDecorator;

/**
 * Function for generating an action parameter decorator.
 * The request stream will be parsed and the entire `body` object will be extracted and be bound to ctx as ctx.body.
 * Populates the property of body to the decorated parameter.
 *
 * For example:
 *
 * ```typescript
 * async create( @Body( 'name' ) ) {}
 * ```
 * @param property name of single property to extract from the `body` object.
 *
 * @returns the parameter decorator.
 */
export function Body( property: string ): ParameterDecorator;

/**
 * For example
 *
 * ```typescript
 * @Body( 'name', validationFunction )
 * create() {}
 *
 * async create( @Body( 'name', validationFunction ) name: string ) {}
 * ```
 *
 * @param property name of single property to extract from the `body` object.
 * @param pipe function for data transformation or validation.
 *
 * @returns the parameter decorator or the method decorator.
 */
export function Body( property: string, pipe: Pipe ): ParameterDecorator & MethodDecorator;

export function Body( ...args: [ ( string | Pipe )?, Pipe? ] ): MethodDecorator & ParameterDecorator {

    createGeneralBeforeAndParameterActionDecorator( {
        interceptorParameter : interceptorParameterBody,
        interceptorBefore : interceptorBeforeBody
    }, ...args );
}
