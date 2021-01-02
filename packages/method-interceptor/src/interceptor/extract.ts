/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: interceptor/extract.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/24/2020
 * Description: 
 ******************************************************************/

import { ParametersShift } from '@ynn/utility-types';
import { KEY_BEFORE, KEY_AFTER, KEY_EXCEPTION, KEY_PARAMETER } from '../constants';
import { Metadata, MetadataBefore, MetadataAfter, MetadataParameter, MetadataException } from '../metadata.interface';
import { Methods, MethodInfo } from './interceptor.interface';

/**
 * extract all interceptor methods of a descriptor with specific key from a method pool.
 *
 * @typeparam T - the type of meadata, it should be extended from Metadata interface
 *
 * @param key - the key for metadata
 * @param descriptor - the target descriptor of the class instance method.
 * @param methods - the method pool that provides interceptor methods.
 *
 * @returns a list of information of extracted methods
 */
function extractMethods<T extends Metadata>( key: keyof Methods, descriptor: PropertyDescriptor, methods: Methods ) {

    const bound: MethodInfo<T>[] = [];

    Reflect.getMetadata( key, descriptor.value )?.forEach( ( metadata: T ) => {
        /**
         * do nothing even if methods[ metadata.type ] is not a function or is undefined.
         */
        bound.push( { method : methods[ metadata.type ], metadata } );
    } );

    return bound;
}


/**
 * extract the before interceptor
 *
 * @param descriptor - the target descriptor of the class instance method.
 * @param methods - the method pool that provides interceptor methods.
 *
 * @return a list of information of extracted methods for *BEFORE INTERCEPTOR*.
 */
function before( ...args: ParametersShift<typeof extractMethods> ) {
    return extractMethods<MetadataBefore>( KEY_BEFORE, ...args );
}


function after( ...args: ParametersShift<typeof extractMethods> ) {
    return extractMethods<MetadataAfter>( KEY_AFTER, ...args );
}

function exception( ...args: ParametersShift<typeof extractMethods> ) {
    return extractMethods<MetadataException>( KEY_EXCEPTION, ...args );
}

function paramtype<T>( constructor: new ( ...args: any[] ) => any, methodName: string | symbol | number, methods: Methods ) {
    const bound: MethodInfo<T>[] = [];

    /**
     * get metadata for PARAMETER INTERCEPTOR of given method.
     */
    const metadatas: MetadataParameter[] = Reflect.getMetadata( KEY_PARAMETER, constructor.prototype, methodName ) || []; 

    /**
     * combine paramtypes and metadatas for interceptor.
     */
    const paramtypes: unknown[] = Reflect.getMetadata( 'design:paramtypes', constructor.prototype, methodName ) || [];

    for( let i = 0, l = Math.max( metadatas.length, paramtypes.length ); i < l; i += 1 ) {

        const metadata = metadatas[ i ] || {};

        bound.push( {
            method : methods[ metadata.type ],
            metadata : {
                ...metadata,
                paramtype : paramtypes[ i ] || null
            }
        } );
    }

    return bound;
}

export default { before, after, exception, paramtype };
