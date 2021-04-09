/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/run-pipe.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/05/2021
 * Description:
 ******************************************************************/

import is from '@lvchengbin/is';
import { Context, createInjectableInstance, Pipe, PipeConstructor, PipeFunction, PipeInterface, Metadata } from '@ynn/core';

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
