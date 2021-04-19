/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/02/2020
 * Description:
 ******************************************************************/

import { Ynn, Options, Context, ContextOptions, ParameterMetadata } from '@ynn/core';

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


export function createApp( options: Options ): Ynn {
    return new Ynn( options );
};

export async function createAppWithRequest(
    options: Options | Ynn,
    context: Context | ContextOptions
): Promise<Context> {
    const app = options instanceof Ynn ? options : createApp( options );
    return app.handle( context );
}

export function createParameterMetadata( options?: Partial<ParameterMetadata> ): ParameterMetadata {
    const metadata: ParameterMetadata = {
        interceptorType : 'parameter',
        parameters : {
            pipes : []
        },
        ...options
    };

    return metadata;
}
