/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: toThrowYnnHttpException/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/25/2021
 * Description:
 ******************************************************************/

import { CustomMatcherResult } from 'jest';
import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils';
import { VariadicFunction } from '@ynn/utility-types';
import { HttpException, HttpExceptionResponse } from '@ynn/http-exception';
import predicate from './predicate';

const passMessage = ( received: unknown, expected: unknown ): ( () => string ) => (): string => {
    return matcherHint( '.toThrowYnnHttpException', 'function', 'type' ) +
        '\n\n' +
        'Expected not to throw:\n' +
        `  ${printExpected( expected?.toJSON?.() ?? expected )}\n` +
        'Thrown:\n' +
        `  ${printReceived( received?.toJSON?.() ?? received )}\n`;
};

const failMessage = ( received: unknown, expected: unknown ): ( () => string ) => (): string => {
    return matcherHint( '.not.toThrowYnnHttpException', 'function', 'type' ) +
        '\n\n' +
        'Expected to throw:\n' +
        `  ${printExpected( expected?.toJSON?.() ?? expected )}\n` +
        'Thrown:\n' +
        `  ${printReceived( received?.toJSON?.() ?? received )}\n`;
};

/**
 *
 * @example
 * ```ts
 * expect( () => { throw new HttpException( 400 ) } ).toThrowYnnHttpException()
 * ```
 *
 * @param callback - the callback function which will throw exception
 * @param response - status, message, response or HttpException instance
 * @param message - error message of HttpException instance.
 */
export default function toThrowYnnHttpException(
    callback: VariadicFunction,
    response?: number | string | HttpExceptionResponse | HttpException,
    error?: string
): CustomMatcherResult {

    console.log( 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', callback );

    if( !callback || typeof callback !== 'function' ) {
        return {
            pass : false,
            message : (): string => `Recevied value must be a function but instead "${callback}" was found`
        };
    }

    let exception: any; // eslint-disable-line @typescript-eslint/no-explicit-any

    try { callback() } catch( e: unknown ) { exception = e }

    if( !exception ) {
        return {
            pass : false,
            message : (): string => 'Expect the fucntion to throw an HttpException.\n But it didn\'t throw anything'
        };
    }

    if( !( exception instanceof HttpException ) ) {
        return {
            pass : false,
            // message : failMessage( error, HttpException )
            message : (): string => `Expect the function to throw an HttpException.\n But ${exception} was thrown`
        };
    }

    /**
     * any HttpException instance will pass the checking if the response argument is empty
     */
    if( !response ) {
        return {
            pass : true,
            message : passMessage( exception, HttpException )
        };
    }

    if( typeof response === 'number' ) {
        if( error === undefined ) {
            if( exception.status === response ) {
                return {
                    pass : true,
                    message : passMessage( exception, { status : response } )
                };
            }

            return {
                pass : false,
                message : failMessage( exception, { status : response } )
            };
        }
        if( exception.status === response && exception.error === error ) {
            return {
                pass : true,
                message : passMessage( exception, { status : response, error } )
            };
        }

        return {
            pass : false,
            message : failMessage( exception, { status : response, error } )
        };
    }

    if( typeof response === 'string' ) {
        if( exception.error === response ) {
            return {
                pass : true,
                message : passMessage( exception, { error : response } )
            };
        }
        return {
            pass : false,
            message : failMessage( exception, { error : response } )
        };
    }

    let httpException: HttpException;

    if( response instanceof HttpException ) {
        httpException = response;
    } else {
        httpException = new HttpException( response, error );
    }

    if( !predicate( exception, response, error ) ) {
        return {
            pass : false,
            message : failMessage( exception, httpException )
        };
    }

    return {
        pass : true,
        message : passMessage( exception, new HttpException( response, error ) )
    };
}
