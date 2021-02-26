/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/fill-params.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/17/2021
 * Description:
 ******************************************************************/

import is from '@lvchengbin/is';
import { VariadicClass } from '@ynn/utility-types';
import { MetadataParameter } from '@ynn/method-interceptor';
import { createInjectableInstance } from './create-injectable-instance';

export async function fillParams<T extends unknown[]>(
    params: unknown[],
    metadatas: ( MetadataParameter | undefined )[],
    paramtypes: VariadicClass[],
    ...args: T
): Promise<unknown[]> {

    for( let i = 0, l = params.length; i < l; i += 1 ) {
        if( metadatas[ i ] === undefined && is.class( paramtypes[ i ] ) ) {
            params[ i ] = await createInjectableInstance( paramtypes[ i ], ...args ); // eslint-disable-line no-await-in-loop
        }
    }

    return params;
}
