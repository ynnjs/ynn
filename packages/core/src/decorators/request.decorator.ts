/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: decorators/request.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description: 
 ******************************************************************/

import Pipe from '../interfaces/pipe.interface';
import { createActionDecorator } from './util';

/**
 * @returns the parameter decorator or the method decorator
 */
export function Request(): ParameterDecorator & MethodDecorator;

/**
 * @returns the parameter decorator
 */
export function Request( property: string ): ParameterDecorator;

/**
 * @returns the parameter decorator or the method decorator
 */
export function Request( pipe: Pipe ): ParameterDecorator & MethodDecorator;

/**
 * @returns the parameter decorator or the method decorator
 */
export function Request( property: string, pipe: Pipe ): ParameterDecorator & MethodDecorator;

export function Request( ...args: [ (string | Pipe)?, Pipe? ] ): ParameterDecorator & MethodDecorator {
    return createActionDecorator( 'request', ...args );
}
