/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/action.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/29/2020
 * Description:
 ******************************************************************/

import { ACTIONS_METADATA_KEY } from '../constants';

export function Action(): MethodDecorator;
export function Action( name: string ): MethodDecorator;

export function Action( name?: string ): MethodDecorator {
    return ( target: any, key: string | symbol, descriptor: TypedPropertyDescriptor<any> ) => {
        const metadata = Reflect.getMetadata( ACTIONS_METADATA_KEY, descriptor.value ) || [];
        metadata.push( name || key );
        Reflect.defineMetadata( ACTIONS_METADATA_KEY, metadata, descriptor.value );
    };
}
