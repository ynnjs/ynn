/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: decorators/header.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/09/2020
 * Description: 
 ******************************************************************/

import Pipe from '../interface/pipe.interface';
import {
    ACTION_RESPONSE_HEADER_METADATA,
    ACTION_HEADER_METADATA,
    PARAM_HEADER_METADATA
} from '../constants';

export function Header( property: string, value: string ): MethodDecorator;
export function Header( headers: Record<string, string> ): MethodDecorator;
export function Header(): ParameterDecorator & MethodDecorator;
export function Header( property: string ): ParameterDecorator & MethodDecorator;
export function Header( pipe: Pipe ): ParameterDecorator & MethodDecorator;
export function Header( property: string, pipe: Pipe ): ParameterDecorator & MethodDecorator;

export function Header( propertyOrPipeOrHeaders?: string | Pipe | Record<string, string>, pipeOrValue?: Pipe  | string ): ParameterDecorator & MethodDecorator {

    const t1 = typeof propertyOrPipeOrHeaders;
    const t2 = typeof pipeOrValue;

    /**
     * Method decorator for action method.
     * Setting header(s) to the response data
     */
    if( ( t1 === 'string' && t2 === 'string' ) || ( propertyOrPipeOrHeaders && t1 === 'object' ) ) {
        return ( target: any, key: string | symbol, parameterIndexOrDescriptor: TypedPropertyDescriptor<any> | number ) => {

            const args = Reflect.getMetadata( ACTION_RESPONSE_HEADER_METADATA, parameterIndexOrDescriptor.value ) || [];

            if( t1 === 'string' ) {
                args.push( [ propertyOrPipeOrHeaders, pipeOrValue ] );
            } else {
                args.push( propertyOrPipeOrHeaders );
            }

            Reflect.defineMetadata( ACTION_RESPONSE_HEADER_METADATA, parameterIndexOrDescriptor.value );
        }
    }

    let property: string | undefined;
    let pipe: Pipe | undefined;

    if( t1 === 'string' ) {
        property = propertyOrPipeOrHeaders as string;
    } else if( t1 === 'function' ) {
        pipe = propertyOrPipeOrHeaders as Pipe;
    }

    if( !pipeOrValue && t2 === 'function' ) {
        pipe = pipeOrValue as Pipe;
    }

    return ( target: any, key: string | symbol, parameterIndexOrDescriptor: TypedPropertyDescriptor<any> | number ) => {
        if( typeof parameterIndexOrDescriptor === 'number' ) {
            /**
             * to generate a parameter decorator
             *
             * record the metadata with the information of parameter decorator
             */
            const args = Reflect.getMetadata( PARAM_HEADER_METADATA, target.constructor, key ) || {};
            args[ parameterIndexOrDescriptor ] ||= [];
            args[ parameterIndexOrDescriptor ].push( { property, pipe } );

            Reflect.defineMetadata( PARAM_HEADER_METADATA, target.constructor, key ) || {};
        } else {

            /**
             * to generate a method decorator for action a method.
             */
            const args = Reflect.getMetadata( ACTION_HEADER_METADATA, parameterIndexOrDescriptor.value ) || [];
            args.push( { property, pipe } );

            Reflect.defineMetadata( ACTION_HEADER_METADATA, args, parameterIndexOrDescriptor.value );
        }
    }
}
