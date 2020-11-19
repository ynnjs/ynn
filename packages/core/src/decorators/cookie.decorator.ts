/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: decorators/cookie.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description: 
 ******************************************************************/

import Pipe from '../interface/pipe.interface';

export function Cookie( property: string, value: string ): MethodDecorator;
export function Cookie( cookies: Record<string, any> ): MethodDecorator;
export function Cookie(): ParameterDecorator & MethodDecorator;
export function Cookie( property: string ): ParameterDecorator & MethodDecorator;
export function Cookie( pipe: Pipe ): ParameterDecorator & MethodDecorator;
export function Cookie( property: string, pipe: Pipe ): ParameterDecorator & MethodDecorator;

export function Cookie( propertyOrPipeOrCookies?: string | Pipe | Record<string, any>, pipeOrValue?: Pipe  | string ): ParameterDecorator & MethodDecorator {

    const t1 = typeof propertyOrPipeOrCookies;
    const t2 = typeof pipeOrValue;

    if( ( t1 === 'string' && t2 === 'string' ) || ( t2 === 'undefined' && t1 === 'object' ) ) {
        return ( target: any, key: string | symbol, parameterIndexOrDescriptor: TypedPropertyDescriptor<any> | number ) => {
        }
    }

    return ( target: any, key: string | symbol, parameterIndexOrDescriptor: TypedPropertyDescriptor<any> | number ) => {
    }
}