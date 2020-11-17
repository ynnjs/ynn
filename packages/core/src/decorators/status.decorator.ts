/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: decorators/status.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/16/2020
 * Description: 
 ******************************************************************/

export function Status( statusCode: number ): MethodDecorator;
export function Status( statusCode: number, message: string ): MethodDecorator;

export function Status( statusCode: number, message?: string ): MethodDecorator {
    return ( target, key: string | symbol, descriptor: TypedPropertyDescriptor<any> ) => {
        Reflect.defineMetadata( '__STATUS__', [ statusCode, message ], descriptor.value );
        return descriptor;
    }
}
