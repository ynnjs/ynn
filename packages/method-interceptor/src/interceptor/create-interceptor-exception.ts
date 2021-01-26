/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-exception.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/28/2020
 * Description:
 ******************************************************************/

import { VariadicClass } from '@ynn/utility-types';
import { KEY_EXCEPTION } from '../constants';
import { MetadataException } from '../metadata.interface';
import extractMethods from './extract-methods';

function createInterceptorException<T extends unknown[] = unknown[]>(
    descriptor: Readonly<PropertyDescriptor>
): ( e: unknown, ...args: T ) => Promise<unknown> {

    const bound = extractMethods( KEY_EXCEPTION, descriptor );

    return async ( e, ...args ): Promise<unknown> => {

        for( const info of bound ) {
            const metadata = info.metadata as MetadataException;

            if( !( 'exceptionType' in metadata ) || e instanceof ( metadata.exceptionType as VariadicClass ) ) {
                return info.method( metadata, e, ...args );
            }
        }
        throw e;
    };
}

export default createInterceptorException;
