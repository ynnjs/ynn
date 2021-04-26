/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/required.pipe.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/26/2021
 * Description:
 ******************************************************************/

import { Context, Metadata, PipeFunction } from '@ynn/core';
import { HttpException, HttpExceptionResponse } from '@ynn/http-exception';
import { ExceptionCallback } from './interfaces';

export function Required<R>( exception?: HttpExceptionResponse | Error | ExceptionCallback<R> ): PipeFunction {

    return async <T>( value: T, ctx: Context, metadata: Metadata ): Promise<T | R> => {

        if( value === '' || value === undefined || value === null ) {

            if( typeof exception === 'function' ) return exception( value, ctx, metadata );

            if( exception instanceof Error ) throw exception;

            const property = ( metadata.parameters as any )?.property; // eslint-disable-line @typescript-eslint/no-explicit-any

            throw new HttpException( {
                status : 400,
                message : [
                    property ? `${property} is required` : 'missing parameter'
                ],
                ...( exception || {} )
            } );
        }

        return value;
    };
}
