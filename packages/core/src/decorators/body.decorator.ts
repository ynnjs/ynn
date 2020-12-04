/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: decorators/body.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/16/2020
 * Description: 
 ******************************************************************/

import Pipe from '../interfaces/pipe.interface';
import { createActionDecorator } from './util';

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
 * @returns the parameter decorator or the method decorator.
 */
export default function Body(): ParameterDecorator & MethodDecorator;

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
export default function Body( property: string ): ParameterDecorator;

/**
 * For example:
 *
 * ```typescript
 * @Body( validationFunction );
 * create() {}
 *
 * async create( @Body( validationFunction ) ) {}
 * ```
 *
 * @param pipe function for data transformation or validation.
 *
 * @returns the parameter decorator or the method decorator.
 */
export default function Body( pipe: Pipe ): ParameterDecorator & MethodDecorator;

/**
 * For example
 *
 * ```typescript
 * @Body( 'name', validationFunction )
 * create() {}
 *
 * async create( @body( 'name', validationFunction ) ) {}
 * ```
 *
 * @param property name of single property to extract from the `body` object.
 * @param pipe function for data transformation or validation.
 *
 * @returns the parameter decorator or the method decorator.
 */
export default function Body( property: string, pipe: Pipe ): ParameterDecorator & MethodDecorator;

export default function Body( ...args: [ (string | Pipe)?, Pipe? ] ): ParameterDecorator & MethodDecorator {
    return createActionDecorator( 'body', ...args );
}
