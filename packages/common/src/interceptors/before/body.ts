/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: request/body.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/03/2020
 * Description:
 ******************************************************************/

import { KoaContext } from '@ynn/koa';
import parser from '@ynn/body';
import { MetadataBefore, MetadataParameter } from '@ynn/method-interceptor';
import { Pipe } from '../../interfaces';

interface BodyParameters {
    property?: string;
    pipe?: Pipe;
}

/**
 * function for interceptor before and interceptor parameter
 *
 * @example
 *
 * @param metadata
 * @param ctx
 */
export async function interceptorBeforeBody(
    metadata: Readonly<MetadataBefore> | Readonly<MetadataParameter>,
    ctx: KoaContext
): Promise<unknown> {
    /**
     * don't parse the body multiple times if it has already been parsed
     */
    if( !( 'body' in ctx ) ) ctx.body = parser( ctx );

    const body = await ctx.body;
    const parameters = metadata.parameters as BodyParameters;
    const value = parameters.property ? body[ parameters.property ] : body;

    return parameters.pipe ? parameters.pipe( value, ctx, parameters ) : value;
}
