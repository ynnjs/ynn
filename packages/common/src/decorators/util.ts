/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/util.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/26/2020
 * Description:
 ******************************************************************/

import { VariadicFunction } from '@ynn/utility-types';
import { saveMetadataBefore, saveMetadataParameter } from '@ynn/method-interceptor';
import { Pipe } from '../interfaces';

export function createGeneralBeforeAndParameterMetadataParameters(
    propertyOrPipe?: string | Pipe,
    pipeFunction?: Pipe
): ( {
    property?: string | symbol | number;
    pipe?: Pipe;
} ) {

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

    const parameters: {
        property?: string | symbol | number;
        pipe?: Pipe;
    } = {};

    property && ( parameters.property = property );
    pipe && ( parameters.pipe = pipe );

    return parameters;
}

export interface CreateGeneralBeforeAndParameterActionDecoratorOptions {
    interceptorParameter?: VariadicFunction;
    interceptorBefore?: VariadicFunction;
}

export function createGeneralBeforeAndParameterActionDecorator(
    options: Readonly<CreateGeneralBeforeAndParameterActionDecoratorOptions>,
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

    return ( target, key: string | symbol, indexOrDescriptor: PropertyDescriptor | number ): void => {
        if( typeof indexOrDescriptor === 'number' ) {
            if( options.interceptorParameter ) {
                saveMetadataParameter( target, key, indexOrDescriptor, options.interceptorParameter, { parameters } );
            }
            return;
        }
        if( options.interceptorBefore ) {
            saveMetadataBefore( indexOrDescriptor, options.interceptorBefore, { parameters } );
        }
    };
}

