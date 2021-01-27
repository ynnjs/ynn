/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-method-decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/26/2021
 * Description:
 ******************************************************************/
import { VariadicFunction } from '@ynn/utility-types';
import { Metadata, MetadataException } from '../metadata.interface';
declare type CreateMethodDecoratorOptions = {
    method: VariadicFunction;
} & Pick<Metadata, 'parameters'> & Pick<MetadataException, 'exceptionType'>;
export default function createMethodDecorator(key: string | symbol, interceptorType: 'after' | 'before' | 'exception', options: Readonly<CreateMethodDecoratorOptions>): MethodDecorator;
export {};
