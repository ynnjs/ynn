/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorators/res.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/17/2021
 * Description:
 ******************************************************************/
import { Pipe } from '@ynn/common';
/**
 * @returns the parameter decorator or the method decorator
 */
export declare function Res(...pipes: Pipe[]): ParameterDecorator & MethodDecorator;
