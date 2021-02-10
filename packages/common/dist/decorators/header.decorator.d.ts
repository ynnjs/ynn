/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/header.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/09/2020
 * Description:
 ******************************************************************/
import { Pipe } from '../interfaces';
export declare function Header(property: string, value: string): MethodDecorator;
export declare function Header(headers: Record<string, string>): MethodDecorator;
export declare function Header(property: string): ParameterDecorator;
export declare function Header(pipe?: Pipe): ParameterDecorator & MethodDecorator;
export declare function Header(property: string, pipe: Pipe): ParameterDecorator & MethodDecorator;
