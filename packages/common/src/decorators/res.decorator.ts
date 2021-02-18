/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorators/res.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/17/2021
 * Description:
 ******************************************************************/

import { Context } from '@ynn/waka';
import { RequiredKeys } from '@ynn/utility-types';
import { Pipe, RequestMetadata, ParameterMetadata } from '../interfaces';
import { createDecorator, executePipes } from './util';

interface ResParameters {
    pipes: Pipe[];
}

type Metadata = RequiredKeys<RequestMetadata<ResParameters>, 'parameters'> | RequiredKeys<ParameterMetadata<ResParameters>, 'parameters'>;

async function requestAndParameterInterceptor( metadata: Metadata, ctx: Context ): Promise<unknown> {
    return executePipes( metadata.parameters.pipes, ctx.response.res, ctx );
}

/**
 * @returns the parameter decorator or the method decorator
 */

export function Res( ...pipes: Pipe[] ): ParameterDecorator & MethodDecorator {

    const parameters = { pipes };

    return createDecorator( {
        parameterInterceptor : requestAndParameterInterceptor,
        requestInterceptor : requestAndParameterInterceptor,
        parameters
    } );
}
