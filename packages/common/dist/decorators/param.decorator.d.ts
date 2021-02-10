/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/param.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description:
 ******************************************************************/
import Pipe from '../interface/pipe.interface';
export declare function Param(): ParameterDecorator & MethodDecorator;
export declare function Param(property: string): ParameterDecorator;
export declare function Param(pipe: Pipe): ParameterDecorator & MethodDecorator;
export declare function Param(property: string, pipe: Pipe): ParameterDecorator & MethodDecorator;
