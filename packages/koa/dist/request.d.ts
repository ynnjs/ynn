/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/request.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 09/30/2020
 * Description:
 ******************************************************************/
/// <reference types="node" />
import util from 'util';
import { Socket } from 'net';
import { TLSSocket } from 'tls';
import { IncomingMessage, IncomingHttpHeaders } from 'http';
import { Http2ServerRequest } from 'http2';
import { URL } from 'url';
import Koa from './application';
import { KoaContext } from './context';
import { KoaResponse } from './response';
declare const QUERY_CACHE: unique symbol;
declare const MOMIZED_URL: unique symbol;
export declare type KoaRequestQuery = Record<string, any>;
export interface KoaRequest {
    URL: URL | Record<any, any>;
    [MOMIZED_URL]?: URL | Record<any, any>;
    [QUERY_CACHE]?: Record<string, KoaRequestQuery>;
    [util.inspect.custom]: () => Record<string, any> | void;
    accept: Record<string, any>;
    accepts: (...args: Array<string | string[]>) => boolean | string | string[];
    acceptsCharsets: (...args: Array<string | string[]>) => string | string[];
    acceptsEncodings: (...args: Array<string | string[]>) => string | string[];
    acceptsLanguages: (...args: Array<string | string[]>) => string | string[];
    app?: Koa;
    charset: string;
    ctx?: KoaContext;
    fresh: boolean;
    get: (field: string) => string;
    header: IncomingHttpHeaders;
    headers: IncomingHttpHeaders;
    host: string;
    hostname: string;
    href: string;
    idempotent: boolean;
    inspect: () => Record<string, any> | void;
    ip: string;
    ips: string[];
    is: ((...types: Array<string | string[]>) => string | false | null) | ((types: string[]) => string | false | null);
    length: number | void;
    method: string;
    origin: string;
    originalUrl?: string;
    path: string;
    protocol: string;
    query: KoaRequestQuery;
    querystring: string;
    req?: IncomingMessage | Http2ServerRequest;
    response?: KoaResponse;
    search: string;
    secure: boolean;
    socket: Socket | TLSSocket;
    stale: boolean;
    subdomains: string[];
    toJSON: () => Record<string, any>;
    type: string;
    url?: string;
}
/**
 * Prototype
 */
declare const Request: KoaRequest;
export default Request;
