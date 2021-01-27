/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-parameter.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/26/2021
 * Description:
 ******************************************************************/

import Storage from '../storage';
import { KEY_PARAMETER } from '../constants';
import { MethodParameter } from '../method.interface';
import { MetadataParameter } from '../metadata.interface';

export type CreateDecoratorParameterOptions<T extends unknown[]> = {
    method: MethodParameter<T>;
} & Pick<MetadataParameter, 'parameters'>;

export function createDecoratorParameter<T extends unknown[] = unknown[]>(
    options: Readonly<CreateDecoratorParameterOptions<T>>
): ParameterDecorator {

    const type = Storage.key();
    const metadata: MetadataParameter = { type, interceptorType : 'parameter' };

    if( 'parameters' in options ) {
        metadata.parameters = options.parameters;
    }

    Storage.set( type, options.method );

    return ( target, key: string | symbol, i: number ): void => {
        const metadatas: MetadataParameter[][] = Reflect.getMetadata( KEY_PARAMETER, target.constructor, key ) || [];

        if( !metadatas[ i ] ) {
            metadatas[ i ] = [];
        }

        metadatas[ i ].push( metadata );

        Reflect.defineMetadata( KEY_PARAMETER, metadatas, target.constructor, key );
    };
}
