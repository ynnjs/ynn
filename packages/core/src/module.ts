/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/module.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 03/28/2021
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import { VariadicClass } from '@ynn/utility-types';
import { Options } from './ynn';
import { MODULE_METADATA_KEY } from './constants';


export function Module( options: Options = {} ): ClassDecorator {
    return ( target: any ): void => { // eslint-disable-line @typescript-eslint/no-explicit-any
        Reflect.defineMetadata( MODULE_METADATA_KEY, options, target );
    };
}

export function getModuleMetadata( target: VariadicClass ): Options {
    return Reflect.getMetadata( MODULE_METADATA_KEY, target );
}
