/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interfaces/response.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/29/2021
 * Description:
 ******************************************************************/

import { Socket } from 'net';
import { ServerResponse, OutgoingHttpHeaders } from 'http';
// import { Options as ContentDispositionOptions } from 'content-disposition';
import { Valueof } from '@ynn/utility-types';
import { Context } from './context.interface';

export interface Response {

    res?: ServerResponse;

    ctx: Context;
    statusCode: number;
    statusMessage: string;

    socket: Socket | null;
    headers: OutgoingHttpHeaders;
    status: number;
    message: string;
    body: unknown;
    length: number | undefined;
    headerSent: boolean;
    vary: () => void;
    // redirect: ( url: string, alt?: string ) => void;
    // attachment: ( filename?: string, options?: ContentDispositionOptions ) => void;
    type: string;
    lastModified: Date | undefined;
    etag: string;
    is: ( ...args: [ ...string[] ] | string[] ) => string | false | null;
    get: ( field: string ) => Valueof<OutgoingHttpHeaders>;
    has: ( field: string ) => boolean;
    set: ( field: string | OutgoingHttpHeaders, val?: Valueof<OutgoingHttpHeaders> ) => void;
    append: ( field: string, value: NonNullable<Valueof<OutgoingHttpHeaders>> ) => void;
    remove: ( field: string ) => void;
    getHeaderNames: () => string[];
    writable: boolean;
    inspect: unknown;
    toJSON: () => Record<string, unknown>;
}
