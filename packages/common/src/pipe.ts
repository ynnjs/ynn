/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/pipe.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/25/2021
 * Description:
 ******************************************************************/

import is from '@lvchengbin/is';
import { Context, createInjectableInstance } from '@ynn/core';
import { Pipe, PipeConstructor, PipeFunction, PipeInterface, Metadata } from './interfaces';

export async function runPipe( pipe: Pipe, value: unknown, ctx: Context, metadata: Metadata ): Promise<unknown> {
    if( is.class( pipe ) ) {
        const instance = await createInjectableInstance( pipe as PipeConstructor, ctx );
        value = instance.transform( value, ctx, metadata );
    } else if( typeof pipe === 'function' ) {
        value = await ( pipe as PipeFunction )( value, ctx, metadata );
    } else {
        value = await ( pipe as PipeInterface ).transform( value, ctx, metadata );
    }
    return value;
}

export async function runPipesInSequence( pipes: Pipe[], value: unknown, ctx: Context, metadata: Metadata ): Promise<unknown> {
    for( const pipe of pipes ) {
        value = await runPipe( pipe, value, ctx, metadata ); // eslint-disable-line no-await-in-loop
    }
    return value;
}
