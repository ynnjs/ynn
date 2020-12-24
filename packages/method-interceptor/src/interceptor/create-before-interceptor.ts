/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-method-before.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/24/2020
 * Description:
 ******************************************************************/

import { KEY_BEFORE } from '../constants';
import { Before } from './interceptor.interface';
import extract from './extract-method';

export default function createMethodBefore<T>(
    descriptor: TypedPropertyDescriptor<any>,
    methods: Record<string, ( ...args: any[] ) => any>
): Before<T> {

    if( !methods ) return () => Promise.resolve();

    const bound = extract( KEY_BEFORE, descriptor, methods );

    return ( ...args ) => {
        const promises = [];

        bound.forEach( ( info ) => {
            promises.push( info.method( info.metadata, ...args ) );
        } );

        return Promise.all( promises );
    }
}
