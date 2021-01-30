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
import Pipe from '../interface/pipe.interface';

interface BodyParameters {
    property?: string;
    pipe?: Pipe;
}

/**
 * @example
 *
 */
export default async function body( metadata: Readonly<MetadataBefore> | Readonly<MetadataParameter>, ctx: KoaContext ): Promise<unknown> {
    /**
     * don't parse the body multiple times if it has already been parsed
     */
    if( !( 'body' in ctx ) ) ctx.body = parser( ctx );

    const body = await ctx.body;
    const parameters = metadata.parameters as BodyParameters;

    const value = ( 'property' in parameters ) ? body[ parameters.property ] : body;

    if( 'pipe' in parameters ) {
        return parameters.pipe( value, ctx, parameters );
    }
    return value;
}
