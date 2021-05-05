/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/ctx.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/03/2020
 * Description:
 ******************************************************************/

import { Context, CommonRequestMetadata, CommonParameterMetadata, Pipe, runPipesInSequence, createGeneralDecorator } from '@ynn/common';

async function requestAndParameterInterceptor(
    metadata: CommonRequestMetadata | CommonParameterMetadata,
    ctx: Context
): Promise<unknown> {
    return runPipesInSequence(
        metadata.parameters.pipes,
        metadata.parameters.property ? ctx[ metadata.parameters.property ] : ctx,
        ctx,
        metadata
    );
}

export function Ctx( ...pipes: Pipe[] ): MethodDecorator & ParameterDecorator;

export function Ctx( property: string ): ParameterDecorator;

export function Ctx( property: string, ...pipe: Pipe[] ): MethodDecorator & ParameterDecorator;

export function Ctx( ...args: [ ( string | Pipe )?, ...Pipe[] ] ): MethodDecorator & ParameterDecorator {
    return createGeneralDecorator( {
        parameterInterceptor : requestAndParameterInterceptor,
        requestInterceptor : requestAndParameterInterceptor
    }, ...args );
}
