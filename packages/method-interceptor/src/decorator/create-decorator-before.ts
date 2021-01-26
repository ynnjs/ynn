/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-before.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/24/2021
 * Description:
 ******************************************************************/

import { KEY_BEFORE } from '../constants';
import { MethodBefore } from '../method.interface';
import { MetadataBefore } from '../metadata.interface';
import createMethodDecorator from './create-method-decorator';

type CreateDecoratorBeforeOptions<T extends unknown[]> = {
    method: MethodBefore<T>;
} & Pick<MetadataBefore, 'parameters' >;

export default function createDecoratorBefore<T extends unknown[]>(
    options: Readonly<CreateDecoratorBeforeOptions<T>>
): MethodDecorator {
    return createMethodDecorator( KEY_BEFORE, 'before', options );
}
