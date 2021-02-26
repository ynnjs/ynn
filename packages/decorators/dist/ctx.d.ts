/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/ctx.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/03/2020
 * Description:
 ******************************************************************/
import { Pipe } from '@ynn/common';
export declare function Ctx(...pipes: Pipe[]): MethodDecorator & ParameterDecorator;
export declare function Ctx(property: string): ParameterDecorator;
export declare function Ctx(property: string, ...pipe: Pipe[]): MethodDecorator & ParameterDecorator;
