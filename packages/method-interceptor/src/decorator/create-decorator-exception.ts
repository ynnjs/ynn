/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-exception.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/26/2021
 * Description:
 ******************************************************************/

import { KEY_EXCEPTION } from '../constants';
import { MethodException } from '../method.interface';
import { MetadataException } from '../metadata.interface';
import createMethodDecorator from './create-method-decorator';

export type CreateDecoratorExceptionOptions = Pick<MetadataException, 'exceptionType' | 'parameters'>;

export function createDecoratorException<T extends unknown[]>(
    method: MethodException<T>,
    options: Readonly<CreateDecoratorExceptionOptions> = {}
): MethodDecorator {
    return createMethodDecorator( KEY_EXCEPTION, 'exception', method, options );
}
