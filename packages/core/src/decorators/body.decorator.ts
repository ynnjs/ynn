/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: decorators/body.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/16/2020
 * Description: 
 ******************************************************************/

import Pipe from '../interfaces/pipe.interface';
import {
    PARAM_BODY_METADATA,
    ACTION_BODY_METADATA,
    // PARAM_QUERY_METADATA,
    // ACTION_QUERY_METADATA,
    // PARAM_HEADER_METADATA,
    // ACTION_HEADER_METADATA,
    // PARAM_PARAM_METADATA,
    // ACTION_PARAM_METADATA
} from '../constants';

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
 */
export function Body(): ParameterDecorator & MethodDecorator;

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
 */
export function Body( property: string ): ParameterDecorator;

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

    const t1 = typeof propertyOrPipe;
    const t2 = typeof pipe;

    let property: string | undefined;
    let pipeFunction: Pipe | undefined;

    if( t1 === 'string' ) {
        property = propertyOrPipe as string;
    } else if( t1 === 'function' ) {
        pipeFunction = propertyOrPipe as Pipe;
    }

    if( !pipe && t2 === 'function' ) {
        pipeFunction = pipe;
    }

    return ( target: any, key: string | symbol, parameterIndexOrDescriptor: TypedPropertyDescriptor<any> | number ) => {
        if( typeof parameterIndexOrDescriptor === 'number' ) {
            /**
             * to generate a parameter decorator
             *
             * record the metadata with the information of parameter decorator.
             */
            const args = Reflect.getMetadata( PARAM_BODY_METADATA, target.constructor, key ) || {};
            args[ parameterIndexOrDescriptor ] ||= [];
            args[ parameterIndexOrDescriptor ].push( {
                paramtype : 'BODY',
                property,
                pipe : pipeFunction
            } );

            Reflect.defineMetadata( PARAM_BODY_METADATA, args, target.constructor, key );
        } else {

            const args = Reflect.getMetadata( ACTION_BODY_METADATA, parameterIndexOrDescriptor.value ) || [];

            args.push( {
                type : 'BODY',
                property,
                pipe: pipeFunction
            } );

            Reflect.defineMetadata( ACTION_BODY_METADATA, args, parameterIndexOrDescriptor.value );
        }
    }
}
