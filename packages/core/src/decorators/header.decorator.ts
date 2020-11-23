/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: decorators/header.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/09/2020
 * Description: 
 ******************************************************************/

import Pipe from '../interface/pipe.interface';

export function Header( property: string, value: string ): MethodDecorator;
export function Header( headers: Record<string, string> ): MethodDecorator;
export function Header(): ParameterDecorator & MethodDecorator;
export function Header( property: string ): ParameterDecorator & MethodDecorator;
export function Header( pipe: Pipe ): ParameterDecorator & MethodDecorator;
export function Header( property: string, pipe: Pipe ): ParameterDecorator & MethodDecorator;

export function Header( propertyOrPipeOrHeaders?: string | Pipe | Record<string, string>, pipeOrValue?: Pipe  | string ): ParameterDecorator & MethodDecorator {

    const t1 = typeof propertyOrPipeOrHeaders;
    const t2 = typeof pipeOrValue;

    /**
     * Method decorator for action method.
     * Setting header(s) to the response data
     */
    if( ( t1 === 'string' && t2 === 'string' ) || ( t1 && t2 === 'undefined' && t1 === 'object' ) ) {
        return ( target: any, key: string | symbol, parameterIndexOrDescriptor: TypedPropertyDescriptor<any> | number ) => {
        }
    }

    return ( target: any, key: string | symbol, parameterIndexOrDescriptor: TypedPropertyDescriptor<any> | number ) => {
    }
}

// export function Header( name: string, value: string ): MethodDecorator {
//     return ( target, key: string | symbol, descriptor: TypedPropertyDescriptor<any> ) => {
//         const exists = Reflect.getMetadata( '__HEADER__', descriptor.value ) || [];
//         const metadata = [ ...exists, [ name, value ] ];
//         Reflect.defineMetadata( '__Header__', metadata, descriptor.value );
//         return descriptor;
//     }
// }
