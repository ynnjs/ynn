/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-after.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/26/2021
 * Description:
 ******************************************************************/
import { MethodAfter } from '../method.interface';
import { MetadataAfter } from '../metadata';
export declare type CreateDecoratorAfterOptions = Pick<MetadataAfter, 'parameters'>;
export declare function createDecoratorAfter<T extends unknown[]>( method: MethodAfter<T>, options?: Readonly<CreateDecoratorAfterOptions> ): MethodDecorator & ClassDecorator;
