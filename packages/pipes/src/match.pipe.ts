/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/match.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/26/2021
 * Description:
 ******************************************************************/

import { Context, Metadata, PipeFunction } from '@ynn/core';
import { HttpException, HttpExceptionResponse } from '@ynn/http-exception';

function handleException<R>(
    value: string | number,
    ctx: Context,
    metadata: Metadata,
    pattern: string,
    exception?: HttpExceptionResponse | Error | ExceptionCallback<R>
): R {

    if( typeof exception === 'function' ) return exception( value, ctx, metadata );

    if( exception instanceof Error ) throw exception;

    const property = ( metadata.parameters as any )?.property; // eslint-disable-line @typescript-eslint/no-explicit-any

    throw new HttpException( {
        status : 400,
        message : [
            property ? `${property} should match ${pattern}` : `parameter does not match ${pattern}`
        ],
        ...( exception || {} )
    } );
}

/**
 *
 * @param pattern - the match pattern, it can be a sting or a regexp or list of strings/regexps
 * @param exception - the exception will be thrown if match failed, the function will throw a HttpException instance by default
 *
 * @example
 *
 * ```ts
 * fn( @Query( 'domain', Match( /\.google\.com$/ ) ) domain: string ) {
 *     return { domain };
 * }
 *
 * fn(
 *     @Query( 'domain', Match( /\.google\.com$/, new Error( 'server error' ) ) ) domain: string
 * ) {
 *     return { domain };
 * }
 *
 * fn(
 *     @Query( 'domain', Match( [ 'example1.com', 'example2.com' ], { status : 400, message : 'message' } ) ) domain: string
 * ) {
 *     return { domain };
 * }
 * ```
 */
export function Match<R>(
    pattern: string | RegExp | ( string | RegExp )[],
    exception?: HttpExceptionResponse | Error | ExceptionCallback<R>
): PipeFunction {

    if( typeof pattern === 'string' ) {
        return async <T extends string | number>( value: T, ctx: Context, metadata: Metadata ): Promise<T | R> => {
            if( pattern === String( value ) ) return value;
            return handleException( value, ctx, metadata, `"${pattern}"`, exception );
        };
    }

    if( pattern instanceof RegExp ) {
        return async <T extends string | number>( value: T, ctx: Context, metadata: Metadata ): Promise<T | R> => {
            if( ( pattern as RegExp ).test( String( value ) ) ) return value;
            return handleException( value, ctx, metadata, `"${pattern.toString()}"`, exception );
        };
    }

    return async <T extends string | number>( value: T, ctx: Context, metadata: Metadata ): Promise<T | R> => {

        const str = String( value );

        for( const item of pattern as ( string | RegExp )[] ) {
            if( ( typeof item === 'string' && item === str ) || ( item instanceof RegExp && item.test( str ) ) ) return value;
        }

        return handleException( value, ctx, metadata, 'the given patterns', exception );
    };
}
