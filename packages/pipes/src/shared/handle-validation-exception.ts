/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: shared/handle-validation-exception.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/23/2021
 * Description:
 ******************************************************************/

import { Context, Metadata } from '@ynn/core';
import { HttpException, HttpExceptionResponse } from '@ynn/http-exception';

export function handleValidationException<T, R>(
    value: T,
    ctx: Context,
    metadata: Metadata,
    httpExceptionResponse: HttpExceptionResponse,
    exception?: HttpExceptionResponse | Error | ExceptionCallback<R>
): R {

    if( typeof exception === 'function' ) return exception( value, ctx, metadata );
    if( exception instanceof Error ) throw exception;

    throw new HttpException( {
        ...httpExceptionResponse,
        ...( exception || {} )
    } );
}
