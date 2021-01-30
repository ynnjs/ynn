/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-exception.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/26/2021
 * Description:
 ******************************************************************/

import { MethodException } from '../method.interface';
import { MetadataException, saveMetadataException } from '../metadata';

export type CreateDecoratorExceptionOptions = Pick<MetadataException, 'exceptionType' | 'parameters'>;

export function createDecoratorException<T extends unknown[]>(
    method: MethodException<T>,
    options: Readonly<CreateDecoratorExceptionOptions> = {}
): MethodDecorator {
    return ( target, key: string | symbol, descriptor: PropertyDescriptor ): void => {
        saveMetadataException( descriptor, method, options );
    };
}
