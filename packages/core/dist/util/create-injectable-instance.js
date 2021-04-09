'use strict';
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/create-injectable-instance.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/17/2021
 * Description:
 ******************************************************************/
Object.defineProperty( exports, '__esModule', { value : true } );
exports.createInjectableInstance = void 0;
const method_interceptor_1 = require( '@ynn/method-interceptor' );
const fill_params_1 = require( './fill-params' );
async function createInjectableInstance( constructor, // eslint-disable-line @typescript-eslint/no-explicit-any
    ...args ) {
    const paramtypes = Reflect.getMetadata( 'design:paramtypes', constructor );
    if( !paramtypes || !paramtypes.length )
        return new constructor();
    const parameter = method_interceptor_1.createInterceptorParameter( constructor );
    const metadatas = method_interceptor_1.getMetadataParameter( constructor );
    const params = await fill_params_1.fillParams( await parameter( ...args ), metadatas, paramtypes, ...args );
    return new constructor( ...params );
}
exports.createInjectableInstance = createInjectableInstance;
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
