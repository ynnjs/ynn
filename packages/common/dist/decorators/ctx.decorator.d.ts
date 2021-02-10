/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/ctx.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/03/2020
 * Description:
 ******************************************************************/
import Pipe from '../interfaces/pipe.interface';
export declare function Ctx(): ParameterDecorator;
export declare function Ctx(property: string): ParameterDecorator;
export declare function Ctx(pipe: Pipe): MethodDecorator & ParameterDecorator;
export declare function Ctx(property: string, pipe: Pipe): MethodDecorator & ParameterDecorator;
