/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-method-decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/26/2021
 * Description:
 ******************************************************************/

import { VariadicFunction } from '@ynn/utility-types';
import Storage from '../storage';
import { Metadata, MetadataAfter, MetadataBefore, MetadataException } from '../metadata.interface';

type M = MetadataAfter | MetadataBefore | MetadataException;

type CreateMethodDecoratorOptions = {
    method: VariadicFunction;
} & Pick<Metadata, 'parameters'> & Pick<MetadataException, 'exceptionType'>;

export default function createMethodDecorator(
    key: string | symbol,
    interceptorType: 'after' | 'before' | 'exception',
    options: Readonly<CreateMethodDecoratorOptions>
): MethodDecorator {

    const type = Storage.key();
    const metadata: M = { type, interceptorType };

    if( 'parameters' in options ) {
        metadata.parameters = options.parameters;
    }

    if( 'exceptionType' in options ) {
        ( metadata as MetadataException ).exceptionType = options.exceptionType;
    }

    Storage.set( type, options.method );

    return ( target: unknown, k: string | symbol, descriptor: PropertyDescriptor ): void => {
        const metadatas: Metadata[] = Reflect.getMetadata( key, descriptor.value ) || [];
        metadatas.push( metadata );
        Reflect.defineMetadata( key, metadatas, descriptor.value );
    };
}
