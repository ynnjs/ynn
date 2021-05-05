/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/query.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description:
 ******************************************************************/

import { Context, Pipe, CommonRequestMetadata, CommonParameterMetadata, runPipesInSequence, createGeneralDecorator } from '@ynn/common';

async function requestAndParameterInterceptor(
    metadata: CommonRequestMetadata | CommonParameterMetadata,
    ctx: Context
): Promise<unknown> {
    return runPipesInSequence(
        metadata.parameters.pipes,
        metadata.parameters.property ? ctx.request.query[ metadata.parameters.property ] : ctx.request.query,
        ctx,
        metadata
    );
}

/**
 * @returns the parameter decorator
 */
export function Query( property: string ): ParameterDecorator;

/**
 * @returns the parameter decorator or the method decorator
 */
export function Query( ...pipes: Pipe[] ): ParameterDecorator & MethodDecorator;

/**
 * @returns the parameter decorator or the method decorator
 */
export function Query( property: string, ...pipes: Pipe[] ): ParameterDecorator & MethodDecorator;

export function Query( ...args: [ ( string | Pipe )?, ...Pipe[] ] ): ParameterDecorator & MethodDecorator {
    return createGeneralDecorator( {
        parameterInterceptor : requestAndParameterInterceptor,
        requestInterceptor : requestAndParameterInterceptor
    }, ...args );
}
