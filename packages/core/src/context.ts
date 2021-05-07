/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/context.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/05/2021
 * Description:
 ******************************************************************/

import { IncomingMessage, ServerResponse } from 'http';
import {
    Request as RequestInterface,
    Response as ResponseInterface,
    Context as ContextInterface,
    Logger as LoggerInterface
} from '@ynn/common';
import { Request, RequestOptions } from './request';
import { Response, ResponseOptions } from './response';

export interface ContextOptions {
    request: Omit<RequestOptions, 'ctx'>;
    response?: Omit<ResponseOptions, 'ctx'>;
    logger?: LoggerInterface;
}

export class Context implements ContextInterface {

    req?: IncomingMessage;
    res?: ServerResponse;

    request: RequestInterface;
    response: ResponseInterface;

    params: Record<string, string> = {};
    matches: [ string | undefined ][] = [];

    logger: LoggerInterface = console;

    startTime = process.hrtime.bigint();

    constructor( options: ContextOptions ) {
        options.logger && ( this.logger = options.logger );
        // this.app = options.app;
        this.request = new Request( { ...options.request, ctx : this } );
        this.response = new Response( { ...options.response ?? {}, ctx : this } );
        this.request.req && ( this.req = this.request.req );
        this.response.res && ( this.res = this.response.res );
    }

    inspect(): Record<string, unknown> {
        return this.toJSON();
    }

    toJSON(): Record<string, unknown> {
        return {
            request : this.request.toJSON(),
            resposne : this.response.toJSON()
            // app : this.app?.toJSON() || null
        };
    }
}
