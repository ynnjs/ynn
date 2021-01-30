/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-before.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/24/2021
 * Description:
 ******************************************************************/

import { MethodBefore } from '../method.interface';
import { MetadataBefore, saveMetadataBefore } from '../metadata';

export type CreateDecoratorBeforeOptions = Pick<MetadataBefore, 'parameters'>;

export function createDecoratorBefore<T extends unknown[]>(
    method: MethodBefore<T>,
    options: Readonly<CreateDecoratorBeforeOptions> = {}
): MethodDecorator {
    return ( target, key: string | symbol, descriptor: PropertyDescriptor ): void => {
        saveMetadataBefore( descriptor, method, options );
    };
}
