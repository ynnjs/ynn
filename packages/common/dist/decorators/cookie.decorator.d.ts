/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/cookie.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description:
 ******************************************************************/
import Pipe from '../interface/pipe.interface';
interface KoaCookieOptions {
    name?: string;
}
/**
 * Function for generating a method decorator
 * The property of cookie will be removed.
 */
export declare function cookie(property: string, value: null): MethodDecorator;
export declare function cookie(property: string, value: string): MethodDecorator;
export declare function Cookie(property: string, value: string, options: KoaCookieOptions): MethodDecorator;
export declare function Cookie(): ParameterDecorator & MethodDecorator;
export declare function Cookie(property: string): ParameterDecorator & MethodDecorator;
export declare function Cookie(pipe: Pipe): ParameterDecorator & MethodDecorator;
export declare function Cookie(property: string, pipe: Pipe): ParameterDecorator & MethodDecorator;
export {};
