/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: decorators/query.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description: 
 ******************************************************************/

import Pipe from '../interfaces/pipe.interface';

export function Query(): ParameterDecorator & MethodDecorator;
export function Query( property: string ): ParameterDecorator & MethodDecorator;
export function Query( pipe: Pipe ): ParameterDecorator & MethodDecorator;
export function Query( property: string, pipe: Pipe ): ParameterDecorator & MethodDecorator;

export function Query( propertyOrPipe: string | Pipe, pipe?: Pipe ): ParameterDecorator | MethodDecorator {
    return ( target: any, key: string | symbol, parameterIndexOrDescriptor: TypedPropertyDescriptor<any> | number ) => {
    }
}
