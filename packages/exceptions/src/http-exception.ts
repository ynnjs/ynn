/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: exceptions/http-exception.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 05/01/2021
 * Description:
 ******************************************************************/

import statuses from 'statuses';

export type HttpExceptionResponse = number
    | string
    | Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export class HttpException extends Error {

    static DEFAULT_STATUS = 500;

    #status: number = HttpException.DEFAULT_STATUS;
    #error: string = statuses.message[ HttpException.DEFAULT_STATUS ] ?? '';
    #response: HttpExceptionResponse;

    constructor( response: HttpExceptionResponse, error?: string ) {
        super();

        this.#response = response;

        if( typeof response === 'number' ) {
            this.status = response;
            error && ( this.error = error );
        } else if( typeof response === 'string' ) {
            this.error = response;
        } else {
            if( typeof response.status === 'number' ) {
                this.status = response.status;
            }

            if( typeof response.error === 'string' ) {
                this.error = response.error;
            }
        }
    }

    set status( status: number ) {
        this.#status = status;
        this.error = statuses.message[ status ] ?? '';
    }

    get status(): number {
        return this.#status;
    }

    set error( error: string ) {
        this.#error = error;
    }

    get error(): string {
        return this.#error;
    }

    get response(): HttpExceptionResponse {
        return this.#response;
    }

    toJSON(): HttpExceptionResponse {
        return {
            status : this.status,
            error : this.error,
            response : this.response
        };
    }
}
