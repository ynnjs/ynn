/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: decorators/req.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description: 
 ******************************************************************/

import Pipe from '../interfaces/pipe.interface';
import { createActionDecorator } from './util';

/**
 * @returns the parameter decorator or the method decorator
 */
export function Req(): ParameterDecorator & MethodDecorator;

/**
 * @returns the parameter decorator
 */
export function Req( property: string ): ParameterDecorator;

/**
 * @returns the parameter decorator or the method decorator
 */
export function Req( pipe: Pipe ): ParameterDecorator & MethodDecorator;

/**
 * @returns the parameter decorator or the method decorator
 */

export function Req( property: string, pipe: Pipe ): ParameterDecorator & MethodDecorator;

export function Req( ...args: [ (string | Pipe)?, Pipe? ] ): ParameterDecorator & MethodDecorator {
    return createActionDecorator( 'req', ...args );
}
