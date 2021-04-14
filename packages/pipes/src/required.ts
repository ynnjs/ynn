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


export function Required( exception?: HttpExceptionResponse | Error ): PipeFunction {

    return <T>( value: T, ctx: Context, metadata: Metadata ): T => {

        if( value === undefined || value === null ) {

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
