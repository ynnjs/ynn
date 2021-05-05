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


// import { VariadicClass } from '@ynn/utility-types';
// import { createInterceptorParameter, getMetadataParameter, InterceptorParameter, MetadataParameter } from '@ynn/method-interceptor';
// import { fillParams } from './fill-params';

// interface CacheContext {
//     parameter: InterceptorParameter;
//     metadatas: ( MetadataParameter | undefined )[];
//     paramtypes: VariadicClass[];
// }

// const Cache: WeakMap<VariadicClass, CacheContext | false> = new WeakMap();

// export async function createInjectableInstance<T, M extends unknown[]>(
//     constructor: VariadicClass<any[], T>, // eslint-disable-line @typescript-eslint/no-explicit-any
//     ...args: M
// ): Promise<T> {
//     const cache = Cache.get( constructor );
//     if( cache === false ) return new constructor();


//     let paramtypes;
//     let parameter;
//     let metadatas;

//     if( cache ) {
//         ( { paramtypes, parameter, metadatas } = cache );
//     } else {

//         paramtypes = Reflect.getMetadata( 'design:paramtypes', constructor );

//         if( !paramtypes || !paramtypes.length ) {
//             Cache.set( constructor, false );
//             return new constructor();
//         }

//         parameter = createInterceptorParameter<M>( constructor );
//         metadatas = getMetadataParameter( constructor );

//         Cache.set( constructor, { paramtypes, parameter, metadatas } );
//     }

//     const params = await fillParams( await parameter( ...args ), metadatas, paramtypes, ...args );

//     return new constructor( ...params );
// }
