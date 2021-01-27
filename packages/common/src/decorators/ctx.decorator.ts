/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/ctx.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/03/2020
 * Description:
 ******************************************************************/

import Pipe from '../interfaces/pipe.interface';
import { createActionDecorator } from './util';

export function Ctx(): ParameterDecorator;

export function Ctx( property: string ): ParameterDecorator;

export function Ctx( pipe: Pipe ): MethodDecorator & ParameterDecorator;

export function Ctx( property: string, pipe: Pipe ): MethodDecorator & ParameterDecorator;

export function Ctx( ...args: [ ( string | Pipe )?, Pipe? ] ): MethodDecorator & ParameterDecorator {
    return createActionDecorator( 'ctx', ...args );
}
