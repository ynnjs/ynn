/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/util.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/26/2020
 * Description:
 ******************************************************************/

import { createDecoratorBefore, createDecoratorParameter } from '@ynn/method-interceptor';
import Pipe from '../interfaces/pipe.interface';
import {
    ACTION_RESPONSE_METADATA_KEY
} from '../constants';

export function createActionDecorator( propertyOrPipe?: string | Pipe, pipeFunction?: Pipe ): MethodDecorator & ParameterDecorator {

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

    if( typeof indexOrDescriptor === 'number' ) {
        return createDecoratorParameter( );
    } else {
        return createDecoratorBefore();
    }
}

export function createActionRequestDecorator() {
}

export function createActionResponseDecorator( type: string, args: any ): MethodDecorator {

    return ( target: any, key: string | symbol, descriptor: TypedPropertyDescriptor<any> ) => {
        const metadata = Reflect.getMetadata( ACTION_RESPONSE_METADATA_KEY, descriptor.value ) || [];
        metadata.push( { type, args } );
        Reflect.defineMetadata( ACTION_RESPONSE_METADATA_KEY, metadata, descriptor.value );
    };
}
