/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/http-exception.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/04/2021
 * Description:
 ******************************************************************/
import { PartialKeys } from '@ynn/utility-types';
export interface HttpExceptionResponse {
    status: number;
    message: unknown;
    error: string;
}
export declare class HttpException extends Error {
    #private;
    constructor( status: number | string | Readonly<PartialKeys<HttpExceptionResponse, 'message' | 'error'>>, message?: string );
    set status( status: number );
    get status(): number;
    set message( message: string );
    get message(): string;
    get response(): HttpExceptionResponse | undefined;
    set response( response: HttpExceptionResponse | undefined );
}
