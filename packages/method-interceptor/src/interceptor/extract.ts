/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: interceptor/extract.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/24/2020
 * Description: 
 ******************************************************************/

import { MethodInterceptorMetadata } from '../metadata.interface';
import { Methods, MethodInfo } from './interceptor.interface';

/**
 * extract all interceptor methods of a descriptor with specific key from a method pool.
 *
 * @typeparam T - the tyep of meadata
 *
 * @param key - the key for metadata
 * @param methods - the method pool that provides interceptor methods.
 * @param descriptor - the target descriptor of the class instance method.
 *
 * @returns a list of extracted methods' information
 */
function before<T = MethodInterceptorMetadata>( key: keyof Methods, descriptor: PropertyDescriptor, methods: Methods ): MethodInfo<T>[] {

    const bound = [];

    Reflect.getMetadata( key, descriptor.value ).forEach( ( metadata: T ) => {
        /**
         * do nothing even if methods[ metadata.type ] is not a function or is undefined.
         */
        bound.push( { method : methods[ metadata.type ], metadata } );
    } );

    return bound;
}

function paramtypes(
    key: keyof Methods,
    constructor: new ( ...args: any[] ) => any,
    methodName: string | symbol | number,
    methods: Methods
): MethodInfo<T>[] {
    const bound = [];

    /**
     * get metadata for PARAMETER INTERCEPTOR of given method.
     */
    const metadatas: ParameterInterceptorMetadata[] = Reflect.getMetadata( key, constructor.prototype, methodName ); 

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

export default { methods, paramtypes };
