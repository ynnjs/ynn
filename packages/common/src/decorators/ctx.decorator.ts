/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/ctx.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/03/2020
 * Description:
 ******************************************************************/

import { Pipe } from '../interfaces';
import { before, parameter } from '../interceptors';
import { createGeneralBeforeAndParameterActionDecorator } from './util';

export function Ctx( ...pipes: Pipe[] ): MethodDecorator & ParameterDecorator;

export function Ctx( property: string ): ParameterDecorator;

export function Ctx( property: string, ...pipe: Pipe[] ): MethodDecorator & ParameterDecorator;

export function Ctx( ...args: [ property?: ( string | Pipe ), ...pipes: Pipe[] ] ): MethodDecorator & ParameterDecorator {
    return createGeneralBeforeAndParameterActionDecorator( {
        interceptorParameter : parameter.ctx,
        interceptorBefore : before.ctx
    }, ...args );
}
