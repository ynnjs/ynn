/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorators/exception.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/17/2021
 * Description:
 ******************************************************************/

import { Context } from '@ynn/waka';
import { Pipe, ExceptionMetadata } from '../interfaces';
import { createExceptionDecorator, executePipes } from './util';

interface ExceptionParameters {
    pipes: Pipe[];
}

export function Exception( ...pipes: Pipe[] ): MethodDecorator {

    const parameters: ExceptionParameters = {
        pipes : [ ...pipes ]
    };

    return createExceptionDecorator( async ( metadata: ExceptionMetadata<ExceptionParameters>, e: unknown, ctx: Context ) => {
        return executePipes( parameters.pipes, e, ctx );
    }, parameters );
}
