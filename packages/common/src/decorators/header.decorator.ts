/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/header.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/09/2020
 * Description:
 ******************************************************************/

import { Headers, Context } from '@ynn/waka';
import { Pipe, CommonRequestMetadata, CommonParameterMetadata, ResponseMetadata } from '../interfaces';
import { createGeneralDecorator, createResponseDecorator } from './util';

type HeaderPair = [ key: string, value: string | undefined | string[] ];

async function responseInterceptor<T>( metadata: ResponseMetadata, response: T, ctx: Context ): T {
    ( metadata.parameters.headers as HeaderPair[] ).forEach( pair => {
        ctx.set( ...pair );
    } );
    return response;
}

async function requestAndParameterInterceptor( metadata: CommonRequestMetadata | CommonParameterMetadata, ctx: Context ): Promise<unknown> {
    const { property, pipes } = metadata.parameters;

    let value: unknown = property ? ctx.get( property ) : ctx.headers;

    for( const pipe of pipes ) {
        value = await pipe( value, ctx ); // eslint-disable-line no-await-in-loop
    }

    return value;
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
export function Header( headers: Headers ): MethodDecorator;

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

export function Header( ...args: [ ( string | Pipe | Headers )?, ( Pipe | string )? ] ): ParameterDecorator & MethodDecorator {

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
            Object.keys( propertyOrPipeOrHeaders as Headers ).forEach( key => {
                headers.push( [ key, ( propertyOrPipeOrHeaders as Headers )[ key ] ] );
            } );
        }

        return createResponseDecorator( responseInterceptor, { headers } );
    }

    return createGeneralDecorator( {
        parameterInterceptor : requestAndParameterInterceptor,
        requestInterceptor : requestAndParameterInterceptor
    }, ...args as [ ( string | Pipe )?, ...Pipe[] ] );
}
