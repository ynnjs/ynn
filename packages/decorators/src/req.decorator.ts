/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/req.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description:
 ******************************************************************/

import { RequiredKeys } from '@ynn/utility-types';
import { Context, Pipe, RequestMetadata, ParameterMetadata, runPipesInSequence, createDecorator } from '@ynn/common';

interface ReqParameters {
    pipes: Pipe[];
}

type Metadata = RequiredKeys<RequestMetadata<ReqParameters>, 'parameters'> | RequiredKeys<ParameterMetadata<ReqParameters>, 'parameters'>;

async function requestAndParameterInterceptor( metadata: Metadata, ctx: Context ): Promise<unknown> {
    return runPipesInSequence( metadata.parameters.pipes, ctx.request.req, ctx, metadata );
}

/**
 * @returns the parameter decorator or the method decorator
 */

export function Req( ...pipes: Pipe[] ): ParameterDecorator & MethodDecorator {

    const parameters = { pipes };

    return createDecorator( {
        parameterInterceptor : requestAndParameterInterceptor,
        requestInterceptor : requestAndParameterInterceptor,
        parameters
    } );
}
