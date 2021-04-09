/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/http-exception.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/04/2021
 * Description:
 ******************************************************************/

import statuses from 'statuses';
import { PartialKeys } from '@ynn/utility-types';

export interface HttpExceptionResponse {
    status: number;
    message: unknown;
    error: string;
}

export class HttpException extends Error {

    #status = 500;
    #message: string = statuses.message[ 500 ] ?? '';
    #response?: HttpExceptionResponse;

    constructor(
        status: number | string | Readonly<PartialKeys<HttpExceptionResponse, 'message' | 'error'>>,
        message?: string
    ) {
        super();
        if( typeof status === 'string' ) {
            this.message = status;
        } else if( typeof status === 'number' ) {
            this.status = status;
            message && ( this.message = message );
        } else {
            const response = { ...status };
            if( !response.error ) {
                response.error = statuses.message[ response.status ] ?? '';
            }
            if( !response.message ) response.message = '';
            this.response = response as HttpExceptionResponse;
        }
    }

    set status( status: number ) {
        this.#status = status;
        this.message = statuses.message[ status ] ?? '';
    }

    get status(): number {
        return this.#status;
    }

    set message( message: string ) {
        this.#message = message;
    }

    get message(): string {
        return this.#message;
    }

    get response(): HttpExceptionResponse | undefined {
        return this.#response;
    }

    set response( response: HttpExceptionResponse | undefined ) {
        this.#response = response;
        if( response ) {
            this.status = response.status;
            this.message = response.error;
        }
    }
}
