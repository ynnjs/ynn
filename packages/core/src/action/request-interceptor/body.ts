/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: request/body.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/03/2020
 * Description: 
 ******************************************************************/

export interface Options {
    property?: string | undefined;
    pipe?: Pipe | undefined;
}

export default function body( ctx, property?: string, pipe ) {
    // ctx.body = bodyParser();
}
