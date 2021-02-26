/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorators/debug.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/23/2021
 * Description:
 ******************************************************************/

import { Context } from '@ynn/core';
import { ParameterMetadata, Logger } from '@ynn/common';
import { createParameterDecorator } from './util';

export function Debug(): ParameterDecorator {
    return createParameterDecorator( ( metadata: ParameterMetadata, ctx: Context ): Logger => ctx.debug );
}
