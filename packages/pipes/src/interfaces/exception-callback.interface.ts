/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interfaces/onexception.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/22/2021
 * Description:
 ******************************************************************/

export interface ExceptionCallback<R> {
    ( value: null | undefined, ctx: Context, metadata: Metadata ): R;
}
