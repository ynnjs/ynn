/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: request/body.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/03/2020
 * Description:
 ******************************************************************/

import parser from '@ynn/body';
import { Context } from '@ynn/waka';
import { MetadataBefore, MetadataParameter } from '@ynn/method-interceptor';
import { Pipe } from '../../interfaces';

interface BodyParameters {
    property?: string;
    pipes: Pipe[];
}

/**
 * function for interceptor before and interceptor parameter
 *
 * @example
 *
 * @param metadata
 * @param ctx
 */
export async function body(
    metadata: MetadataBefore | MetadataParameter,
    ctx: Context
): Promise<unknown> {

    /**
     * don't parse the body multiple times if it has already been parsed
     */
    if( ctx.request.body === undefined ) ctx.request.body = await parser( ctx );

    const body = ctx.request.body;
    const { property, pipes } = metadata.parameters as BodyParameters;

    let res: unknown;

    if( property ) {
        try {
            res = ( body as any )[ property ]; // eslint-disable-line @typescript-eslint/no-explicit-any
        } catch( e: unknown ) {
            res = undefined;
        }
    } else res = body;

    for( const pipe of pipes ) {
        res = await pipe( res, ctx ); // eslint-disable-line no-await-in-loop
    }

    return res;
}
