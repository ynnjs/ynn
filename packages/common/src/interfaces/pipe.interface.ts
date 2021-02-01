/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interfaces/pipe.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/16/2020
 * Description:
 ******************************************************************/

import { KoaContext } from '@ynn/koa';
import { ActionMetadata } from './metadata.interface';

export interface Pipe {
    ( value: unknown, ctx: KoaContext, metadata: ActionMetadata ): unknown;
}
