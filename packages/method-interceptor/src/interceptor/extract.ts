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
import { MetadataBefore, MetadataAfter, MetadataParameter, MetadataException } from '../metadata.interface';
import { Methods, MethodInfo } from './interceptor.interface';

/**
 * extract all interceptor methods of a descriptor with specific key from a method pool.
 *
 * @typeparam T - the tyep of meadata
 *
 * @param key - the key for metadata
 * @param descriptor - the target descriptor of the class instance method.
 * @param methods - the method pool that provides interceptor methods.
 *
 * @returns a list of information of extracted methods
 */
function extractMethods<T>( key: keyof Methods, descriptor: PropertyDescriptor, methods: Methods ): MethodInfo<T>[] {

    const bound = [];

    Reflect.getMetadata( key, descriptor.value ).forEach( ( metadata: T ) => {
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

function paramtypes<T>(
    constructor: new ( ...args: any[] ) => any,
    methodName: string | symbol | number,
    methods: Methods
): MethodInfo<T>[] {
    const bound = [];

    /**
     * get metadata for PARAMETER INTERCEPTOR of given method.
     */
    const metadatas: MetadataParameter[] = Reflect.getMetadata( KEY_PARAMETER, constructor.prototype, methodName ); 

    /**
     * combine paramtypes and metadatas for interceptor.
     */
    Reflect.getMetadata( 'design:paramtypes', constructor.prototype, methodName ).forEach( ( paramtype: unknown, i: number ) => {

        const metadata = metadatas[ i ];
        metadata.paramtype = paramtype;

        bound.push( {
            method : methods[ metadata.type ],
            metadata : { ...( metadatas[ i ] || {} ), paramtype }
        } );
    } );

    return bound;
}

export default { before, after, exception, paramtypes };
