/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interfaces/onexception.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/22/2021
 * Description:
 ******************************************************************/

import { Context, Metadata } from '@ynn/common';

export interface ExceptionCallback<T, R> {
    ( value: T, ctx: Context, metadata: Metadata ): R;
}
