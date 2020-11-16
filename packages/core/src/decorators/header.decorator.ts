/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: decorators/header.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/09/2020
 * Description: 
 ******************************************************************/



export function Header( name: string, value: string ): MethodDecorator {
    return ( target, key: string | symbol, descriptor: TypedPropertyDescriptor<any> ) => {
        const exists = Reflect.getMetadata( '__HEADER__', descriptor.value ) || [];
        const metadata = [ ...exists, [ name, value ] ];
        Reflect.defineMetadata( '__Header__', metadata, descriptor.value );
        return descriptor;
    }
}
