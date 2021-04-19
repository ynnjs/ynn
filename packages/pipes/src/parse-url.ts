/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/parse-url.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/25/2021
 * Description:
 ******************************************************************/

import { URL } from 'url';
import { Context, Metadata } from '@ynn/core';
import { HttpException } from '@ynn/http-exception';

export function ParseURL( url: string, ctx: Context, metadata: Metadata ): URL {
    try { return new URL( url ) } catch( e: unknown ) {

        const property = ( metadata.parameters as any )?.property; // eslint-disable-line @typescript-eslint/no-explicit-any

        throw new HttpException( {
            status : 400,
            message : [
                property ? `Parameter ${property} must be a valid URL` : 'Invalid URL'
            ]
        } );
    }
}
