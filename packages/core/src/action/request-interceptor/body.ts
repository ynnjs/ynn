/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: request/body.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/03/2020
 * Description: 
 ******************************************************************/

import body from '@ynn/body';

export interface Options {
    property?: string | undefined;
    pipe?: Pipe | undefined;
}

export default async function body( ctx, options: Options ) {
    /**
     * don't parse the body again if it has already been parsed
     */
    if( !ctx.body ) {
        ctx.body = await body( ctx );
    }

    const { property, pipe } = options;
    const value = property === undefined ? ctx.body[ property ] : ctx.body;

    if( pipe ) {
        pipe( value, ctx, options );
    }
}
