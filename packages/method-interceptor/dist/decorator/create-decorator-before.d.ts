/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-before.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/24/2021
 * Description:
 ******************************************************************/
import { MethodBefore } from '../method.interface';
import { MetadataBefore } from '../metadata.interface';
export declare type CreateDecoratorBeforeOptions<T extends unknown[]> = {
    method: MethodBefore<T>;
} & Pick<MetadataBefore, 'parameters'>;
export declare function createDecoratorBefore<T extends unknown[]>(options: Readonly<CreateDecoratorBeforeOptions<T>>): MethodDecorator;
