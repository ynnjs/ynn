/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/query.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description:
 ******************************************************************/

import { saveMetadataParameter, saveMetadataBefore } from '@ynn/method-interceptor';
import { Pipe } from '../interfaces';
import { interceptorBeforeQuery, interceptorParameterQuery } from '../interceptors';
import { createGeneralMetadataParameters } from './util';

/**
 * @returns the parameter decorator
 */
export function Query( property: string ): ParameterDecorator;

/**
 * @returns the parameter decorator or the method decorator
 */
export function Query( pipe?: Pipe ): ParameterDecorator & MethodDecorator;

/**
 * @returns the parameter decorator or the method decorator
 */
export function Query( property: string, pipe: Pipe ): ParameterDecorator & MethodDecorator;

export function Query( ...args: [ ( string | Pipe )?, Pipe? ] ): ParameterDecorator & MethodDecorator {

    const parameters = createGeneralMetadataParameters( ...args );

    return ( target, key: string | symbol, indexOrDescriptor: PropertyDescriptor | number ): void => {
        if( typeof indexOrDescriptor === 'number' ) {
            saveMetadataParameter( target, key, indexOrDescriptor, interceptorParameterQuery, { parameters } );
        } else {
            saveMetadataBefore( indexOrDescriptor, interceptorBeforeQuery, { parameters } );
        }
    };
}
