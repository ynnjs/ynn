/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: decorators/request.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description: 
 ******************************************************************/

import Pipe from '../interfaces/pipe.interface';
import { PARAM_REQUEST_METADATA, ACTION_REQUEST_METADATA } from '../constants';
import { createActionDecorator } from './util';

export function Request(): ParameterDecorator & MethodDecorator;
export function Request( property: string ): ParameterDecorator;
export function Request( pipe: Pipe ): ParameterDecorator & MethodDecorator;
export function Request( property: string, pipe: Pipe ): ParameterDecorator & MethodDecorator;

export function Request( ...args: [ (string | Pipe)?, Pipe? ] ): ParameterDecorator & MethodDecorator {
    return createActionDecorator( PARAM_REQUEST_METADATA, ACTION_REQUEST_METADATA, ...args );
}
