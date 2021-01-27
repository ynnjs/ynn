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
import { MethodParameterInfo, MethodParameter } from '../method.interface';
import Storage from '../storage';

function createInterceptorParameter<T extends unknown[]>(
    constructor: VariadicClass,
    methodName: string
): ( ...args: T ) => Promise<unknown[]> {

    type Info = MethodParameterInfo<MethodParameter<T>>;

    const bound: Info[][] = [];
    const metadatas: ( MetadataParameter[] | undefined )[] = Reflect.getMetadata( KEY_PARAMETER, constructor, methodName ) || [];

    Reflect.getMetadata( 'design:paramtypes', constructor.prototype, methodName )?.forEach( ( paramtype: unknown, i: number ) => {
        const metadata = metadatas[ i ];

        if( !metadata ) {
            bound.push( [ { metadata : { paramtype } } ] );
        } else {
            const mds: Info[] = [];

            /**
             * added paramtype property to each metadata object
             */
            metadata.forEach( m => {

                const method = Storage.get( m.type );

                if( !method ) {
                    throw new Error( `method ${m.type.toString()} not exists in the method list` );
                }

                mds.push( { method, metadata : { ...m, paramtype } } );
            } );

            bound.push( mds );
        }
    } );

    return async ( ...args: T ): Promise<unknown[]> => {
        const promises: Promise<unknown>[] = [];

        bound.forEach( ( metadata ) => {

            if( !metadata.length ) {
                promises.push( Promise.resolve( null ) );
                return;
            }

            const last = metadata[ metadata.length - 1 ];

            let promise: Promise<unknown> = Promise.resolve( last.method?.( last.metadata, ...args ) ?? null );

            for( let i = metadata.length - 2; i >= 0; i -= 1 ) {
                const item = metadata[ i ];
                promise = promise.then( () => {
                    return item.method?.( item.metadata, ...args ) ?? null;
                } );
            }

            promises.push( promise );
        } );

        return Promise.all( promises );
    };
}

export default createInterceptorParameter;
