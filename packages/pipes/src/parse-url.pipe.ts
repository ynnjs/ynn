/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/parse-url.pipe.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/26/2021
 * Description:
 ******************************************************************/

import { URL } from 'url';
import { Context, Metadata, PipeFunction } from '@ynn/common';
import { HttpException } from '@ynn/exceptions';
import { ExceptionCallback, ExceptionResponseObject } from './interfaces';

export function ParseURL(
    exception?: ExceptionResponseObject | Error | ExceptionCallback<string, URL | Promise<URL>>
): PipeFunction {

    return async ( url: string, ctx: Context, metadata: Metadata ): Promise<URL> => {

        try { return new URL( url ) } catch( e: unknown ) {

            if( typeof exception === 'function' ) return exception( url, ctx, metadata );

            if( exception instanceof Error ) throw exception;

            const property = ( metadata.parameters as any )?.property; // eslint-disable-line @typescript-eslint/no-explicit-any

            throw new HttpException( {
                status : 400,
                message : [
                    property ? `Parameter ${property} must be a valid URL` : 'Invalid URL'
                ],
                ...( exception ?? {} )
            } );
        }
    };
}
