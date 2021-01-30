/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/query.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description:
 ******************************************************************/

import Pipe from '../interfaces/pipe.interface';
import { createActionDecorator } from './util';

/**
 * @returns the parameter decorator
 */
export function Query( property: string ): ParameterDecorator;

/**
 * @returns the parameter decorator or the method decorator
 */
export function Query( pipe?: Pipe ): ParameterDecorator & MethodDecorator;

/**
 * @returns the parameter decorator or the method decorator
 */
export function Query( property: string, pipe: Pipe ): ParameterDecorator & MethodDecorator;

export function Query( ...args: [ ( string | Pipe )?, Pipe? ] ): ParameterDecorator & MethodDecorator {
    return createActionDecorator( 'query', ...args );
}
