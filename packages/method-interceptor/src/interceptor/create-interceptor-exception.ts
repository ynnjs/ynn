/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-exception.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/28/2020
 * Description:
 ******************************************************************/

import { GlobalFunction } from '@ynn/utility-types';
import { KEY_EXCEPTION } from '../constants';
import { MetadataException } from '../metadata';
import extractMethods from './extract-methods';

export interface InterceptorException<T extends unknown[] = unknown[]> {
    ( e: unknown, ...args: T ): Promise<unknown>;
}

export function createInterceptorException<T extends unknown[] = unknown[]>(
    descriptorOrConstructor: Readonly<PropertyDescriptor> | GlobalFunction
): InterceptorException<T> {

    const bound = extractMethods( KEY_EXCEPTION, descriptorOrConstructor );

    return async ( e, ...args ): Promise<unknown> => {

        for( const info of bound ) {
            const metadata = info.metadata as MetadataException;

            if( !( 'exceptionType' in metadata ) || e instanceof ( metadata.exceptionType as GlobalFunction ) ) {
                return info.method( metadata, e, ...args );
            }
        }
        throw e;
    };
}
