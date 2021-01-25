/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-before.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/24/2021
 * Description:
 ******************************************************************/
import { MetadataBefore } from '../metadata.interface';
declare type CreateBeforeDecoratorOptions = Partial<Pick<MetadataBefore, 'type' | 'parameters'>> & {
    method: (...args: any[]) => any;
};
export default function createBeforeDecorator(options: CreateBeforeDecoratorOptions): MethodDecorator;
export {};
