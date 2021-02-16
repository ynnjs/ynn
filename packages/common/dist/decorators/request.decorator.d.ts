/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/request.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description:
 ******************************************************************/
import { Pipe } from '../interfaces';
/**
 * @returns the parameter decorator
 */
export declare function Request(property: string): ParameterDecorator;
/**
 * @returns the parameter decorator or the method decorator
 */
export declare function Request(...pipes: Pipe[]): ParameterDecorator & MethodDecorator;
/**
 * @returns the parameter decorator or the method decorator
 */
export declare function Request(property: string, ...pipes: Pipe[]): ParameterDecorator & MethodDecorator;
