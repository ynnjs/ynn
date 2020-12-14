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

export default interface Pipe {
    ( value: any, ctx: KoaContext, metadata: ActionMetadata ): any;
}
