/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/param.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description:
 ******************************************************************/

import { Context } from '@ynn/core';
import { runPipesInSequence, Pipe, CommonRequestMetadata, CommonParameterMetadata } from '@ynn/common';
import { createGeneralDecorator } from './util';

async function requestAndParameterInterceptor(
    metadata: CommonRequestMetadata | CommonParameterMetadata,
    ctx: Context
): Promise<unknown> {
    return runPipesInSequence(
        metadata.parameters.pipes,
        ctx,
        // metadata.parameters.property ? ctx.params[ metadata.parameters.property ] : ctx.params,
        ctx,
        metadata
    );
}

export function Param( property: string ): ParameterDecorator;
export function Param( ...pipe: Pipe[] ): ParameterDecorator & MethodDecorator;
export function Param( property: string, ...pipe: Pipe[] ): ParameterDecorator & MethodDecorator;

export function Param( ...args: [ ( string | Pipe )?, ...Pipe[] ] ): ParameterDecorator & MethodDecorator {
    return createGeneralDecorator( {
        parameterInterceptor : requestAndParameterInterceptor,
        requestInterceptor : requestAndParameterInterceptor
    }, ...args );
}
