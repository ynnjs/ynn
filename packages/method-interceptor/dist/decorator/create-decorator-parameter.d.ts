/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-parameter.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/26/2021
 * Description:
 ******************************************************************/
import { MethodParameter } from '../method.interface';
import { MetadataParameter } from '../metadata';
export declare type CreateDecoratorParameterOptions = Pick<MetadataParameter, 'parameters'>;
export declare function createDecoratorParameter<T extends unknown[]>(method: MethodParameter<T>, options?: Readonly<CreateDecoratorParameterOptions>): ParameterDecorator;
