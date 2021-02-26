/******************************************************************
 * Copyright (C) 2021 Ynn
 *
 * File: src/required.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/24/2021
 * Description:
 ******************************************************************/

import { Context } from '@ynn/core';
import { HttpException, Metadata } from '@ynn/common';

export function Required<T>( value: T, ctx: Context, metadata: Metadata ): T {

    if( value === undefined || value === null ) {

        const property = ( metadata.parameters as any )?.property; // eslint-disable-line @typescript-eslint/no-explicit-any

        throw new HttpException( {
            status : 400,
            message : [
                property ? `${property} is required` : 'missing parameter'
            ]
        } );
    }

    return value;
}
