/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/run-pipe-in-sequence.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/05/2021
 * Description:
 ******************************************************************/

import { Context, Pipe, Metadata } from '@ynn/core';
import { runPipe } from './run-pipe';

export async function runPipesInSequence( pipes: Pipe[], value: unknown, ctx: Context, metadata: Metadata ): Promise<unknown> {
    for( const pipe of pipes ) {
        value = await runPipe( pipe, value, ctx, metadata ); // eslint-disable-line no-await-in-loop
    }
    return value;
}
