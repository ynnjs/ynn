/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorators/logger.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/17/2021
 * Description:
 ******************************************************************/

import { Context, ParameterMetadata, Logger as LoggerInterface } from '@ynn/core';
import { createParameterDecorator } from './util';

export function Logger(): ParameterDecorator {
    return createParameterDecorator( ( metadata: ParameterMetadata, ctx: Context ): LoggerInterface => ctx.logger );
}
