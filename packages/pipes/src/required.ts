/******************************************************************
 * Copyright (C) 2021 Ynn
 *
 * File: src/required.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/24/2021
 * Description:
 ******************************************************************/

import { Context, Metadata } from '@ynn/core';
import { HttpException, HttpExceptionResponse } from '@ynn/http-exception';

interface RequiredCallback<R> {
    ( value: null | undefined, ctx: Context, metadata: Metadata ): R;
}

export function Required<R>( exception?: HttpExceptionResponse | Error | RequiredCallback<R> ): PipeFunction {

    return async <T>( value: T, ctx: Context, metadata: Metadata ): Promise<T | R> => {

        if( value === undefined || value === null ) {

            if( typeof exception === 'function' ) return await exception( value, ctx, metadata );

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
