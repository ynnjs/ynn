/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/extract.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/24/2020
 * Description:
 ******************************************************************/

import { VariadicClass, ParametersShift, PartialKeys } from '@ynn/utility-types';
import { KEY_BEFORE, KEY_AFTER, KEY_EXCEPTION, KEY_PARAMETER } from '../constants';
import {
    Metadata,
    MetadataBefore,
    MetadataAfter,
    MetadataParameter,
    MetadataException
} from '../metadata.interface';
import {
    Methods,
    MethodInfo,
    MethodBefore,
    MethodAfter,
    MethodException,
    MethodParameter
} from './interceptor.interface';

/**
 * extract all interceptor methods of a descriptor with specific key from a method pool.
 *
 * @typeparam T - the type of meadata, it should be extended from Metadata interface
 * @typeparam M - the type of values for methods object.
 *
 * @param key - the key for metadata
 * @param descriptor - the target descriptor of the class instance method.
 * @param methods - the method pool that provides interceptor methods.
 *
 * @returns a list of information of extracted methods
 */
function extractMethods<T extends Metadata, M>(
    key: keyof Methods<M>,
    descriptor: Readonly<PropertyDescriptor>,
    methods: Readonly<Methods<M>>
): MethodInfo<T, M>[] {

    const bound: MethodInfo<T, M>[] = [];

    Reflect.getMetadata( key, descriptor.value )?.forEach( ( metadata: T ) => {
        const method = methods[ metadata.type ];

        /**
         * throw error if the method cannot be found in the method list.
         */
        if( !method ) {
            throw new Error( `method ${metadata.type} not exists in method list.` );
        }
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
function before( ...args: Readonly<ParametersShift<typeof extractMethods>> ): MethodInfo<MetadataBefore, MethodBefore>[] {
    return extractMethods<MetadataBefore, MethodBefore>( KEY_BEFORE, ...args );
}


function after( ...args: Readonly<ParametersShift<typeof extractMethods>> ): MethodInfo<MetadataAfter, MethodAfter>[] {
    return extractMethods<MetadataAfter, MethodAfter>( KEY_AFTER, ...args );
}

function exception( ...args: Readonly<ParametersShift<typeof extractMethods>> ): MethodInfo<MetadataException, MethodException>[] {
    return extractMethods<MetadataException, MethodException>( KEY_EXCEPTION, ...args );
}

/**
 * MethodInfo of MethodParameter may not have `method` property
 */
function parameter(
    constructor: VariadicClass,
    methodName: keyof Methods<MethodParameter>,
    methods: Readonly<Methods<MethodParameter>>
): PartialKeys<MethodInfo<MetadataParameter, MethodParameter>, 'method'>[] {

    const bound: MethodInfo<Partial<MetadataParameter>, MethodParameter>[] = [];

    /**
     * get metadata for PARAMETER INTERCEPTOR of given method.
     */
    const metadatas: ( MetadataParameter | undefined )[] = Reflect.getMetadata( KEY_PARAMETER, constructor.prototype, methodName ) || [];

    /**
     * get the parameters metadata which is generated by typescript automatically
     */
    Reflect.getMetadata( 'design:paramtypes', constructor.prototype, methodName ).forEach( ( paramtype: unknown, i: number ) => {

        /**
         * combine paramtypes and metadatas for interceptor.
         */
        const metadata = metadatas[ i ];

        if( !metadata ) {
            bound.push( { metadata : { paramtype } } );
        } else {

            const method = methods[ metadata.type ];

            if( !method ) {
                throw new Error( `method ${metadata.type} not exists in the method list` );
            }

            bound.push( { method, metadata : { ...metadata, paramtype } } );
        }
    } );

    return bound;
}

export default { before, after, exception, parameter };
