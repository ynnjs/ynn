/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/status.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/16/2020
 * Description:
 ******************************************************************/

import { Context, ResponseMetadata, createDecorator } from '@ynn/common';

type Result = { code: number; message?: string } | number | undefined;

type Handler = ( ctx: Context ) => Result | Promise<Result> | void;

interface StatusParametersWithHandler {
    handler?: Handler;
}

interface StatusParametersWithCode {
    code?: number;
    message?: string;
}

type StatusParameters = StatusParametersWithHandler | StatusParametersWithCode;

export function Status( handler: Handler ): MethodDecorator;
export function Status( code: number, message?: string ): MethodDecorator;

export function Status( codeOrHandler: number | Handler, message?: string ): MethodDecorator {

    const parameters: StatusParameters = {};

    if( typeof codeOrHandler === 'function' ) {
        ( parameters as StatusParametersWithHandler ).handler = codeOrHandler;
    } else {
        ( parameters as StatusParametersWithCode ).code = codeOrHandler;
        typeof message === 'string' && ( ( parameters as StatusParametersWithCode ).message = message );
    }

    return createDecorator( {
        responseInterceptor : async ( metadata: ResponseMetadata, value: unknown, ctx: Context ) => {
            const parameters = metadata.parameters as StatusParameters;

            if( 'handler' in parameters && parameters.handler ) {
                const res = await parameters.handler( ctx );
                if( res ) {
                    if( typeof res === 'number' ) {
                        ctx.response.status = res;
                    } else {
                        res.code && ( ctx.response.status = res.code );
                        typeof res.message === 'string' && ( ctx.response.message = res.message );
                    }
                }
            } else {
                const { code, message } = parameters as StatusParametersWithCode;
                code && ( ctx.response.status = code );
                typeof message === 'string' && ( ctx.response.message = message );
            }

            return value;
        },
        parameters
    } );
}
