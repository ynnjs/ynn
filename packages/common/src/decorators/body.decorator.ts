/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/body.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/16/2020
 * Description:
 ******************************************************************/

import { createDecoratorParameter, createDecoratorBefore } from '@ynn/method-interceptor';
import Pipe from '../interfaces/pipe.interface';
import body from '../interceptors';

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

export function Body( propertyOrPipe?: string | Pipe, pipeFunction?: Pipe ): MethodDecorator & ParameterDecorator {

    const t1 = typeof propertyOrPipe;
    const t2 = typeof pipeFunction;

    let property: string | undefined;
    let pipe: Pipe | undefined;

    /**
     * both property and pipe can be empty
     */
    if( t1 === 'string' ) property = propertyOrPipe as string;
    else if( t1 === 'function' ) pipe = propertyOrPipe as Pipe;

    if( !pipe && t2 === 'function' ) pipe = pipeFunction as Pipe;

    const parameters = {};

    property && ( parameters.property = property );
    pipe && ( parameters.pipe = pipe );

    if( property && !pipe ) {
        return createDecoratorParameter( body, { parameters } );
    }

    return createDecoratorBefore( body, { parameters } );

    if( typeof indexOrDescriptor === 'number' ) {
        return createDecoratorParameter( body, { parameters } );
    }
    return createDecoratorBefore( body, { parameters } );
}

// export function Body( ...args: [ ( string | Pipe )?, Pipe? ] ): ParameterDecorator & MethodDecorator {
//     return createActionDecorator( ...args );
// }
