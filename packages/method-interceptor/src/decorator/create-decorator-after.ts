/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-after.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/26/2021
 * Description:
 ******************************************************************/

import { KEY_AFTER } from '../constants';
import { MethodAfter } from '../method.interface';
import { MetadataAfter } from '../metadata.interface';
import createMethodDecorator from './create-method-decorator';

export type CreateDecoratorAfterOptions = Pick<MetadataAfter, 'parameters'>;

export function createDecoratorAfter<T extends unknown[]>(
    method: MethodAfter<T>,
    options: Readonly<CreateDecoratorAfterOptions> = {}
): MethodDecorator {
    return createMethodDecorator( KEY_AFTER, 'after', method, options );
}
