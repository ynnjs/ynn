/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: core/action.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 05/03/2021
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import { ACTION_METADATA_KEY } from '@ynn/common';

/**
 * Generate the `@Action` decorator which is used to mark a instance method to be an `Action` in contorller.
 *
 * @param name - the action name, the method name will be used if empty
 *
 * @return a method decorator
 */
export function Action( name?: string ): MethodDecorator {
    return ( target, key: string | symbol, descriptor: PropertyDescriptor ): void => {
        const metadata = Reflect.getMetadata( ACTION_METADATA_KEY, descriptor.value ) || [];
        metadata.push( name ?? key );
        Reflect.defineMetadata( ACTION_METADATA_KEY, metadata, descriptor.value );
    };
}
