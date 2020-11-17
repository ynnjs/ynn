/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: decorators/param.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description: 
 ******************************************************************/

import Pipe from '../interface/pipe.interface';

export function Param(): ParameterDecorator & MethodDecorator;
export function Param( property: string ): ParameterDecorator & MethodDecorator;
export function Param( pipe: Pipe ): ParameterDecorator & MethodDecorator;
export function Param( property: string, pipe: Pipe ): ParameterDecorator & MethodDecorator;

export function Param( propertyOrPipe?: string | Pipe, pipe?: Pipe ): ParameterDecorator & MethodDecorator {
    return ( target: any, key: string | symbol, parameterIndexOrDescriptor: TypedPropertyDescriptor<any> | number ) => {
    }
}
