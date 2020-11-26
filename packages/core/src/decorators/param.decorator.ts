/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: decorators/param.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description: 
 ******************************************************************/

import Pipe from '../interface/pipe.interface';
import { PARAM_PARAM_METADATA, ACTION_PARAM_METADATA } from '../constants';
import { createActionDecorator } from './util';

export function Param(): ParameterDecorator & MethodDecorator;
export function Param( property: string ): ParameterDecorator;
export function Param( pipe: Pipe ): ParameterDecorator & MethodDecorator;
export function Param( property: string, pipe: Pipe ): ParameterDecorator & MethodDecorator;

export function Param( ...args: [ (string | Pipe)?, Pipe ] ): ParameterDecorator & MethodDecorator {
    return createActionDecorator( PARAM_PARAM_METADATA, ACTION_PARAM_METADATA, ...args );
}
