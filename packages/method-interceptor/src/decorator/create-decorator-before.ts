/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-before.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/24/2021
 * Description:
 ******************************************************************/

import { KEY_BEFORE } from '../constants';
import { MethodBefore } from '../method.interface';
import { MetadataBefore } from '../metadata.interface';
import Storage from '../storage';

interface CreateDecoratorBeforeOptions<T extends unknown[]> {
    parameters?: unknown;
    method: MethodBefore<T>;
}

export default function createDecoratorBefore<T extends unknown[]>( options: CreateDecoratorBeforeOptions<T> ): MethodDecorator {

    const key = Storage.key();

    const metadata: MetadataBefore = {
        type : key,
        interceptorType : 'before'
    };

    if( 'parameters' in options ) {
        metadata.parameters = options.parameters;
    }

    Storage.set( key, options.method );

    return ( target: unknown, key: string | symbol, descriptor: PropertyDescriptor ): void => {
        const metadatas: MetadataBefore[] = Reflect.getMetadata( KEY_BEFORE, descriptor.value ) || [];
        metadatas.push( metadata );
        Reflect.defineMetadata( KEY_BEFORE, metadatas, descriptor.value );
    };
}
