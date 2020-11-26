/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: decorators/util.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/26/2020
 * Description: 
 ******************************************************************/

import Pipe from '../interfaces/pipe.interface';
import { ACTION_PARAMETER_METADATA_KEY, ACTION_METHOD_METADATA_KEY } from '../constants';

export function createActionDecorator( type: string, propertyOrPipe?: string | Pipe, pipeFunction?: Pipe ): MethodDecorator & ParameterDecorator {

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

    return ( target: any, key: string | symbol, indexOrDescriptor: TypedPropertyDescriptor<any> | number ) => {

        if( typeof indexOrDescriptor === 'number' ) {
            /**
             * to generate a parameter decorator
             * record the metadata with the information of parameter decorator
             */
            const args = Reflect.getMetadata( ACTION_PARAMETER_METADATA_KEY, target.constructor, key ) || {};
            args[ indexOrDescriptor ] ||= [];
            args[ indexOrDescriptor ].push( { type, property, pipe } );
            Reflect.defineMetadata( ACTION_PARAMETER_METADATA_KEY, args, target.constructor, key );
        } else {
            const args = Reflect.getMetadata( ACTION_METHOD_METADATA_KEY, indexOrDescriptor.value ) || [];
            args.push( { type, property, pipe } );
            Reflect.defineMetadata( ACTION_METHOD_METADATA_KEY, args, indexOrDescriptor.value );
        }
    };
}

export function createActionRequestDecorator() {
}

// export function createActionResponseDecorator( metadataKey: string | symbol, ) {
// }
