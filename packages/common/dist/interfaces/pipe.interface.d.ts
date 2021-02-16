/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interfaces/pipe.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/16/2020
 * Description:
 ******************************************************************/
import { Context } from '@ynn/waka';
export interface Pipe<T = unknown, R = unknown> {
    (value: T, ctx: Context): R;
}
