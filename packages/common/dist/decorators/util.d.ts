/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/util.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/26/2020
 * Description:
 ******************************************************************/
import { VariadicFunction } from '@ynn/utility-types';
import { Pipe } from '../interfaces';
export declare function createGeneralBeforeAndParameterMetadataParameters(propertyOrPipe?: string | Pipe, pipeFunction?: Pipe): ({
    property?: string | symbol | number;
    pipe?: Pipe;
});
export interface CreateGeneralBeforeAndParameterActionDecoratorOptions {
    interceptorParameter: VariadicFunction;
    interceptorBefore: VariadicFunction;
}
export declare function createGeneralBeforeAndParameterActionDecorator(options: Readonly<CreateGeneralBeforeAndParameterActionDecoratorOptions>, propertyOrPipe?: string | Pipe, pipeFunction?: Pipe): MethodDecorator & ParameterDecorator;
