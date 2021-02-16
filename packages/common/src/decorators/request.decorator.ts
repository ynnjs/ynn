/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/request.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description:
 ******************************************************************/

import { Context } from '@ynn/waka';
import { Pipe, CommonRequestMetadata, CommonParameterMetadata } from '../interfaces';
import { createGeneralDecorator, executePipes } from './util';

async function requestAndParameterInterceptor(
    metadata: CommonRequestMetadata | CommonParameterMetadata,
    ctx: Context
): Promise<unknown> {
    return executePipes(
        metadata.parameters.pipes,
        metadata.parameters.property ? ctx.request[ metadata.parameters.property ] : ctx.request,
        ctx
    );
}

/**
 * @returns the parameter decorator
 */
export function Request( property: string ): ParameterDecorator;

/**
 * @returns the parameter decorator or the method decorator
 */
export function Request( ...pipes: Pipe[] ): ParameterDecorator & MethodDecorator;

/**
 * @returns the parameter decorator or the method decorator
 */
export function Request( property: string, ...pipes: Pipe[] ): ParameterDecorator & MethodDecorator;

export function Request( ...args: [ ( string | Pipe )?, ...Pipe[] ] ): ParameterDecorator & MethodDecorator {
    return createGeneralDecorator( {
        parameterInterceptor : requestAndParameterInterceptor,
        requestInterceptor : requestAndParameterInterceptor
    }, ...args );
}
