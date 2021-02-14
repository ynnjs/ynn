/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/02/2020
 * Description:
 ******************************************************************/

import Waka, { Options, Context, ContextOptions } from '@ynn/waka';

export function createContext(
    request?: Readonly<Partial<ContextOptions[ 'request' ]>>,
    response?: Readonly<Partial<ContextOptions[ 'response' ]>>
): Context {
    return new Context( {
        request : {
            url : '/',
            method : 'GET',
            ...request
        },
        response : { ...response }
    } );
}


export function createApp( options: Options ): Waka {
    return new Waka( options );
};

export async function createAppWithRequest(
    options: Options | Waka,
    context: Context | ContextOptions
): Promise<Context> {
    const app = options instanceof Waka ? options : createApp( options );
    return app.handle( context );
}
