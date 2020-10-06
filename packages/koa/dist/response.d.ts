/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/response.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/01/2020
 * Description:
 ******************************************************************/
/// <reference types="node" />
import util from 'util';
import { Socket } from 'net';
import { TLSSocket } from 'tls';
import { Readable, Writable } from 'stream';
import { IncomingMessage, ServerResponse, OutgoingHttpHeaders } from 'http';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';
import { Options as ContentDispositionOptions } from 'content-disposition';
import { KoaContext } from './context';
declare const BODY: unique symbol;
declare const EXPLICIT_STATUS: unique symbol;
export declare type KoaResponseHeaderValue = OutgoingHttpHeaders[keyof OutgoingHttpHeaders];
export declare type KoaResponseBody = string | null | Buffer | Readable | Writable | Record<any, any>;
export interface KoaResponse {
    [BODY]?: KoaResponseBody;
    [EXPLICIT_STATUS]?: boolean;
    [util.inspect.custom]: () => Record<string, any> | void;
    append: (field: string, value: string | string[]) => void;
    attachment: (filename: string, options: ContentDispositionOptions) => void;
    body: KoaResponseBody;
    ctx?: KoaContext;
    etag: string;
    flushHeaders: () => void;
    get: (field: string) => KoaResponseHeaderValue;
    has: (field: string) => boolean;
    header: OutgoingHttpHeaders;
    headerSent: boolean;
    headers: OutgoingHttpHeaders;
    inspect: () => Record<string, any> | void;
    is: ((...types: Array<string | string[]>) => string | false | null) | ((types: string[]) => string | false | null);
    length: number | undefined;
    message: string;
    remove: (field: string) => void;
    req?: IncomingMessage | Http2ServerRequest;
    res?: ServerResponse | Http2ServerResponse;
    redirect: (url: string, alt: string) => void;
    set: (field: string | Record<string, string | string[]>, val?: KoaResponseHeaderValue) => void;
    socket: Socket | TLSSocket;
    status: number;
    toJSON: () => Record<string, any>;
    type: string;
    vary: (field: string) => void;
    writable: boolean;
    lastModified: Date | undefined;
}
declare const Response: KoaResponse;
export default Response;
