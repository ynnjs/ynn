/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: decorators/request.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description: 
 ******************************************************************/

import Pipe from '../interfaces/pipe.interface';

export function Request(): ParameterDecorator & MethodDecorator;
export function Request( pipe: Pipe ): ParameterDecorator & MethodDecorator;

export function Request( pipe?: Pipe ): ParameterDecorator & MethodDecorator {
    return ( target: any, key: string | symbol, parameterIndexOrDescriptor: TypedPropertyDescriptor<any> | number ) => {
    }
}
