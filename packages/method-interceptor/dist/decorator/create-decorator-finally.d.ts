/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-finally.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/05/2021
 * Description:
 ******************************************************************/
import { MethodFinally } from '../method.interface';
import { MetadataFinally } from '../metadata';
export declare type CreateDecoratorFinallyOptions = Pick<MetadataFinally, 'parameters'>;
export declare function createDecoratorFinally<T extends unknown[]>( method: MethodFinally<T>, options?: Readonly<CreateDecoratorFinallyOptions> ): MethodDecorator & ClassDecorator;
