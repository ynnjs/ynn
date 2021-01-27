/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/header.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/09/2020
 * Description:
 ******************************************************************/

import Pipe from '../interface/pipe.interface';
import { createActionDecorator, createActionResponseDecorator } from './util';

export function Header( property: string, value: string ): MethodDecorator;
export function Header( headers: Record<string, string> ): MethodDecorator;
export function Header(): ParameterDecorator & MethodDecorator;
export function Header( property: string ): ParameterDecorator;
export function Header( pipe: Pipe ): ParameterDecorator & MethodDecorator;
export function Header( property: string, pipe: Pipe ): ParameterDecorator & MethodDecorator;

export function Header( ...args: [ ( string | Pipe | Record<string, string> )?, ( Pipe | string )? ] ): ParameterDecorator & MethodDecorator {

    const [ propertyOrPipeOrHeaders, pipeOrValue ] = args;
    const t1 = typeof propertyOrPipeOrHeaders;
    const t2 = typeof pipeOrValue;

    /**
     * Method decorator for action method.
     * Setting header(s) to the response data
     */
    if( ( t1 === 'string' && t2 === 'string' ) || ( propertyOrPipeOrHeaders && t1 === 'object' ) ) {

        const args = [];

        if( t1 === 'string' ) {
            args.push( [ propertyOrPipeOrHeaders as string, pipeOrValue as string ] );
        } else {
            Object.keys( propertyOrPipeOrHeaders as Record<string, string> ).forEach( key => {
                args.push( [ key, propertyOrPipeOrHeaders[ key ] ] );
            } );
        }

        return createActionResponseDecorator( 'header', args );
    }

    return createActionDecorator( 'header', ...args as [ ( string | Pipe )?, Pipe? ] );
}
