/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/header.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/09/2020
 * Description:
 ******************************************************************/

import { OutgoingHttpHeaders } from 'http';
import { Valueof } from '@ynn/utility-types';
import { Context, Pipe, CommonRequestMetadata, CommonParameterMetadata, ResponseMetadata } from '@ynn/core';
import { runPipesInSequence } from '@ynn/util';
import { createGeneralDecorator, createResponseDecorator } from './util';

type HeaderPair = [ key: string, value: Valueof<OutgoingHttpHeaders> ];

async function responseInterceptor<T>( metadata: ResponseMetadata, response: T, ctx: Context ): Promise<T> {
    ( metadata.parameters as { headers: HeaderPair[] } ).headers.forEach( pair => {
        ctx.set( ...pair );
    } );
    return response;
}

async function requestAndParameterInterceptor( metadata: CommonRequestMetadata | CommonParameterMetadata, ctx: Context ): Promise<unknown> {
    return runPipesInSequence(
        metadata.parameters.pipes,
        metadata.parameters.property ? ctx.get( metadata.parameters.property ) : ctx.headers,
        ctx,
        metadata
    );
}

/**
 * set response header with property: value
 *
 * @example
 *
 * ```ts
 *     class Controller {
 *         @Action()
 *         @Header( 'X-Custom-Header', 'value' )
 *         index() {}
 *     }
 * ```
 *
 * @param property - key of header
 * @param value - value of header
 *
 * @return a method decorator
 */
export function Header( property: string, value: string ): MethodDecorator;

/**
 * set response headers with an Object
 *
 * @example
 *
 * ```ts
 *     class Controller {
 *         @Action()
 *         @Header( { 'X-Custom-Header' : 'value', 'Content-Type' : 'application/json' } )
 *         index() {}
 *     }
 * ```
 *
 * @param headers - the object of headers
 *
 * @return a method decorator
 */
export function Header( headers: OutgoingHttpHeaders ): MethodDecorator;

/**
 * Get request header with it's name
 *
 * @example
 *
 * ```ts
 *     class Controller {
 *         @Action()
 *         @Header( 'X-Custom-Header' )
 *         index() {}
 *     }
 * ```
 */
export function Header( property: string ): ParameterDecorator;
export function Header( ...pipes: Pipe[] ): ParameterDecorator & MethodDecorator;
export function Header( property: string, ...pipes: Pipe[] ): ParameterDecorator & MethodDecorator;

export function Header( ...args: [ ( string | Pipe | OutgoingHttpHeaders )?, ( Pipe | string )? ] ): ParameterDecorator & MethodDecorator {

    const [ propertyOrPipeOrHeaders, pipeOrValue ] = args;
    const t1 = typeof propertyOrPipeOrHeaders;
    const t2 = typeof pipeOrValue;

    /**
     * Method decorator for action method.
     * Setting header(s) to the response data
     */
    if( ( t1 === 'string' && t2 === 'string' ) || ( args.length === 1 && t1 !== 'function' && t1 !== 'string' ) ) {

        const headers: HeaderPair[] = [];

        if( t1 === 'string' ) {
            headers.push( [ propertyOrPipeOrHeaders as string, pipeOrValue as string ] );
        } else {
            Object.keys( propertyOrPipeOrHeaders as OutgoingHttpHeaders ).forEach( key => {
                headers.push( [ key, ( propertyOrPipeOrHeaders as OutgoingHttpHeaders )[ key ] ] );
            } );
        }

        return createResponseDecorator( responseInterceptor, { headers } );
    }

    return createGeneralDecorator( {
        parameterInterceptor : requestAndParameterInterceptor,
        requestInterceptor : requestAndParameterInterceptor
    }, ...args as [ ( string | Pipe )?, ...Pipe[] ] );
}
