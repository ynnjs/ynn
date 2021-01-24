/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptor/create-interceptor-parameter.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/05/2021
 * Description:
 ******************************************************************/

import { VariadicClass } from '@ynn/utility-types';
import { KEY_PARAMETER } from '../constants';
import { MetadataParameter } from '../metadata.interface';
import { InterceptorParameter, Methods, MethodParameterInfo, MethodParameter } from './interceptor.interface';

function createInterceptorParameter<T extends unknown[]>(
    constructor: VariadicClass,
    methodName: string,
    methods?: Readonly<Methods<MethodParameter<T>>>
): InterceptorParameter<T> {

    const bound: MethodParameterInfo<MethodParameter<T>>[] = [];
    const metadatas: ( MetadataParameter | undefined )[] = Reflect.getMetadata( KEY_PARAMETER, constructor.prototype, methodName ) || [];

    Reflect.getMetadata( 'design:paramtypes', constructor.prototype, methodName ).forEach( ( paramtype: unknown, i: number ) => {
        const metadata = metadatas[ i ];

        if( !metadata ) {
            bound.push( { metadata : { paramtype } } );
        } else {
            const method = methods?.[ metadata.type ];

            if( !Object.prototype.hasOwnProperty.call( methods, metadata.type ) ) {
                throw new Error( `method ${metadata.type} not exists in the method list` );
            }

            bound.push( { method, metadata : { ...metadata, paramtype } } );
        }
    } );

    return async ( ...args: T ): Promise<unknown[]> => {
        const promises: Promise<unknown>[] = [];

        bound.forEach( ( info ) => {
            promises.push( info.method?.( info.metadata, ...args ) ?? Promise.resolve( null ) );
        } );

        return Promise.all( promises );
    };
}

export default createInterceptorParameter;
