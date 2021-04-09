/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-finally.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/05/2021
 * Description:
 ******************************************************************/

import { MethodFinally } from '../method.interface';
import { MetadataFinally, saveMetadataFinally } from '../metadata';

export type CreateDecoratorFinallyOptions = Pick<MetadataFinally, 'parameters'>;

export function createDecoratorFinally<T extends unknown[]>(
    method: MethodFinally<T>,
    options: Readonly<CreateDecoratorFinallyOptions> = {}
): MethodDecorator & ClassDecorator {
    return ( target, key?: string | symbol, descriptor?: PropertyDescriptor ): void => {
        saveMetadataFinally( descriptor ?? target, method, options );
    };
}
