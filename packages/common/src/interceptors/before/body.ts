/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: request/body.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/03/2020
 * Description: 
 ******************************************************************/

import parser from '@ynn/body';
import Pipe from '../interface/pipe.interface';


/**
 * @example
 *
 */
export default async function body( options, ctx ) {
    /**
     * don't parse the body again if it has already been parsed
     */
    if( !ctx.body ) {
        ctx.body = await parser( ctx );
    }

    const { property, pipe } = options;
    const value = property === undefined ? ctx.body[ property ] : ctx.body;

    if( pipe ) {
        pipe( value, ctx, options );
    }
}
