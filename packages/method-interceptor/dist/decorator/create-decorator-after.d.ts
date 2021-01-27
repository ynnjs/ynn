/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-after.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/26/2021
 * Description:
 ******************************************************************/
import { MethodAfter } from '../method.interface';
import { MetadataAfter } from '../metadata.interface';
export declare type CreateDecoratorAfterOptions<T extends unknown[]> = {
    method: MethodAfter<T>;
} & Pick<MetadataAfter, 'parameters'>;
export declare function createDecoratorAfter<T extends unknown[]>(options: Readonly<CreateDecoratorAfterOptions<T>>): MethodDecorator;
