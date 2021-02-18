/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/create-injectable-instance.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/17/2021
 * Description:
 ******************************************************************/

import { VoidFunction } from '@ynn/utility-types';
import { createInterceptorParameter, getMetadataParameter } from '@ynn/method-interceptor';
import fillParams from './fill-params';


export default async function createInjectableInstance<T extends VoidFunction, M extends unknown[]>(
    constructor: T,
    ...args: M
): Promise<T> {
    const paramtypes = Reflect.getMetadata( 'design:paramtypes', constructor );
    if( !paramtypes || !paramtypes.length ) return new constructor();

    const parameter = createInterceptorParameter<M>( constructor );
    const metadatas = getMetadataParameter( constructor );

    const params = await fillParams( await parameter( ...args ), metadatas, paramtypes, ...args );

    return new constructor( ...params );
}
