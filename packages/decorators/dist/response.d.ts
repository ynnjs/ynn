/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/response.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description:
 ******************************************************************/
import { Pipe } from '@ynn/common';
export declare function Response(data: unknown, ...pipes: Pipe[]): MethodDecorator & ClassDecorator;
