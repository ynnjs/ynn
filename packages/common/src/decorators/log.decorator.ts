/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorators/logger.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/17/2021
 * Description:
 ******************************************************************/

import { Context } from '@ynn/waka';
import { ParameterMetadata, Logger } from '../interfaces';
import { createParameterDecorator } from './util';

export function Log(): ParameterDecorator {
    return createParameterDecorator( ( metadata: ParameterMetadata, ctx: Context ): Logger => ctx.app.logger );
}
