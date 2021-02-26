/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/create-injectable-instance.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/17/2021
 * Description:
 ******************************************************************/

import { VariadicClass } from '@ynn/utility-types';
import { createInterceptorParameter, getMetadataParameter } from '@ynn/method-interceptor';
import { fillParams } from './fill-params';


export async function createInjectableInstance<T, M extends unknown[]>(
    constructor: VariadicClass<any[], T>, // eslint-disable-line @typescript-eslint/no-explicit-any
    ...args: M
): Promise<T> {
    const paramtypes = Reflect.getMetadata( 'design:paramtypes', constructor );
    if( !paramtypes || !paramtypes.length ) return new constructor();

    const parameter = createInterceptorParameter<M>( constructor );
    const metadatas = getMetadataParameter( constructor );

    const params = await fillParams( await parameter( ...args ), metadatas, paramtypes, ...args );

    return new constructor( ...params );
}