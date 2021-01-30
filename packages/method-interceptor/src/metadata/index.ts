/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: metadata/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/30/2021
 * Description:
 ******************************************************************/

import { VariadicFunction } from '@ynn/utility-types';
import { KEY_BEFORE, KEY_AFTER, KEY_EXCEPTION, KEY_PARAMETER } from '../constants';
import { Storage } from '../storage';
import { MetadataBefore, MetadataAfter, MetadataException, MetadataParameter } from './metadata.interface';
import { MethodBefore, MethodAfter, MethodException, MethodParameter } from '../method.interface';
export * from './metadata.interface';

function storeMethod( method: VariadicFunction ): symbol {
    const key = Storage.key();
    Storage.set( key, method );
    return key;
}

function saveMethodMetadata<T>( key: symbol | string, descriptor: PropertyDescriptor, metadata: T ): void {
    const metadatas: T[] = Reflect.getMetadata( key, descriptor.value ) || [];
    metadatas.push( metadata );
    Reflect.defineMetadata( key, metadatas, descriptor.value );
}

export function saveMetadataBefore<T extends unknown[]>(
    descriptor: PropertyDescriptor,
    method: MethodBefore<T>,
    options: Readonly<Pick<MetadataBefore, 'parameters'>> = {}
): void {

    const metadata: MetadataBefore = {
        type : storeMethod( method ),
        interceptorType : 'before'
    };

    if( 'parameters' in options ) {
        metadata.parameters = options.parameters;
    }

    saveMethodMetadata( KEY_BEFORE, descriptor, metadata );
}

export function saveMetadataAfter<T extends unknown[]>(
    descriptor: PropertyDescriptor,
    method: MethodAfter<T>,
    options: Pick<MetadataAfter, 'parameters'> = {}
): void {
    const metadata: MetadataAfter = {
        type : storeMethod( method ),
        interceptorType : 'after'
    };

    if( 'parameters' in options ) {
        metadata.parameters = options.parameters;
    }
    saveMethodMetadata( KEY_AFTER, descriptor, metadata );
}

export function saveMetadataException<T extends unknown[]>(
    descriptor: PropertyDescriptor,
    method: MethodException<T>,
    options: Pick<MetadataException, 'exceptionType' | 'parameters'> = {}
): void {

    const metadata: MetadataException = {
        type : storeMethod( method ),
        interceptorType : 'exception'
    };

    if( 'parameters' in options ) {
        metadata.parameters = options.parameters;
    }

    if( 'exceptionType' in options ) {
        metadata.exceptionType = options.exceptionType;
    }
    saveMethodMetadata( KEY_EXCEPTION, descriptor, metadata );
}

export function saveMetadataParameter<T extends unknown[]>(
    target: unknown,
    key: string | symbol,
    i: number,
    method: MethodParameter<T>,
    options: Readonly<Pick<MetadataParameter, 'parameters'>> = {}
): void {
    type M = Omit<MetadataParameter, 'paramtype'>;
    const metadata: M = {
        type : storeMethod( method ),
        interceptorType : 'parameter'
    };

    if( 'parameters' in options ) {
        metadata.parameters = options.parameters;
    }

    const constructor: any = ( target as any ).constructor; // eslint-disable-line

    const metadatas: M[][] = Reflect.getMetadata( KEY_PARAMETER, constructor, key ) || [];

    if( !metadatas[ i ] ) metadatas[ i ] = [ metadata ];
    else metadatas[ i ].push( metadata );

    Reflect.defineMetadata( KEY_PARAMETER, metadatas, constructor, key );
}
