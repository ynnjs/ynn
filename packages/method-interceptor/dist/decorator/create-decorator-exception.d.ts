/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-exception.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/26/2021
 * Description:
 ******************************************************************/
import { MethodException } from '../method.interface';
import { MetadataException } from '../metadata';
export declare type CreateDecoratorExceptionOptions = Pick<MetadataException, 'exceptionType' | 'parameters'>;
export declare function createDecoratorException<T extends unknown[]>(method: MethodException<T>, options?: Readonly<CreateDecoratorExceptionOptions>): MethodDecorator;
