/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/req.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description:
 ******************************************************************/
import { Pipe } from '@ynn/common';
/**
 * @returns the parameter decorator or the method decorator
 */
export declare function Req(...pipes: Pipe[]): ParameterDecorator & MethodDecorator;
