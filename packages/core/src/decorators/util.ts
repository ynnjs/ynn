/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: decorators/util.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/26/2020
 * Description: 
 ******************************************************************/

import Pipe from '../interfaces/pipe.interface';

export function createActionDecorator(
    parameterKey: string | symbol,
    actionKey: string | symbol,
    propertyOrPipe?: string | Pipe,
    pipeFunction?: Pipe
): MethodDecorator & ParameterDecorator {

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
            const args = Reflect.getMetadata( parameterKey, target.constructor, key ) || {};
            args[ indexOrDescriptor ] ||= [];
            args[ indexOrDescriptor ].push( { property, pipe } );
            Reflect.defineMetadata( parameterKey, args, target.constructor, key );
        } else {
            const args = Reflect.getMetadata( actionKey, indexOrDescriptor.value ) || [];
            args.push( { property, pipe } );
            Reflect.defineMetadata( actionKey, args, indexOrDescriptor.value );
        }
    };
}
