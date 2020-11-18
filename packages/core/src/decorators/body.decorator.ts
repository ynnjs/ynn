/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: decorators/body.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/16/2020
 * Description: 
 ******************************************************************/

import Pipe from '../interfaces/pipe.interface';

/**
 * Function for generating an action parameter decorator or a method decorator.
 * The entire `body` object will be extracted and will be bound to ctx as ctx.body.
 * Populates the decorated parameter with the value of body while using it to generate a parameter decorator.
 *
 * For example:
 *
 * ```typescript
 * @Body()
 * create() {}
 *
 * async create( @Body() account: CreateAccountDto ) {}
 * ```
 */
export function Body(): ParameterDecorator & MethodDecorator;

/**
 * For example:
 *
 * ```typescript
 * @Body( 'name' )
 * create() {}
 *
 * async create( @Body( 'name' ) ) {}
 * ```
 * @param property name of single property to extract from the `body` object.
 */
export function Body( property: string ): ParameterDecorator & MethodDecorator;

/**
 * For example:
 *
 * ```typescript
 * @Body( validationFunction );
 * create() {}
 *
 * async create( @Body( validationFunction ) ) {}
 * ```
 */
export function Body( pipe: Pipe ): ParameterDecorator & MethodDecorator;

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
 */
export function Body( property: string, pipe: Pipe ): ParameterDecorator & MethodDecorator;

export function Body( propertyOrPipe?: string | Pipe, pipe?: Pipe ): ParameterDecorator & MethodDecorator {
    return ( target: any, key: string | symbol, parameterIndexOrDescriptor: TypedPropertyDescriptor<any> | number ) => {
        if( typeof parameterIndexOrDescriptor === 'number' ) {

            console.log( propertyOrPipe, pipe );
        }
    }
}
