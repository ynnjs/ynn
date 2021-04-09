/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorators/exception.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/17/2021
 * Description:
 ******************************************************************/

import { Context, Pipe, ExceptionMetadata } from '@ynn/core';
import { runPipesInSequence } from '@ynn/util';
import { createExceptionDecorator } from './util';

interface ExceptionParameters {
    pipes: Pipe[];
}

export function Exception( ...pipes: Pipe[] ): MethodDecorator {

    const parameters: ExceptionParameters = {
        pipes : [ ...pipes ]
    };

    return createExceptionDecorator( async ( metadata: ExceptionMetadata<ExceptionParameters>, e: unknown, ctx: Context ) => {
        return runPipesInSequence( parameters.pipes, e, ctx, metadata );
    }, parameters );
}
