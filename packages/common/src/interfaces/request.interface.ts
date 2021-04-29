/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interfaces/request.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/29/2021
 * Description:
 ******************************************************************/

import { ParsedUrlQuery } from 'querystring';
import { Socket } from 'net';
import { IncomingMessage, IncomingHttpHeaders } from 'http';
import { Context } from './context.interface';

export interface Request {

    req?: IncomingMessage;

    ctx: Context;
    url: string;
    method: string;
    originalUrl: string;
    body: unknown;
    httpVersionMajor: number;
    proxyIpHeader: string;
    subdomainOffset: number;
    proxy: boolean;
    maxIpsCount?: number;

    headers: IncomingHttpHeaders;
    origin: string;
    href: string;
    path: string;
    query: ParsedUrlQuery;
    querystring: string;
    search: string;
    host: string;
    hostname: string;
    URL: URL;
    fresh: boolean;
    stale: boolean;
    idempotent: boolean;
    socket: Socket | null;
    charset: string;
    length: number | undefined;
    protocol: string;
    secure: boolean;
    ips: string[];
    ip: string;
    subdomains: string[];
    accept: Accepts;
    accepts: string[] | string | false;
    acceptsEncoding: string | false;
    acceptsCharsets: string | false;
    acceptsLanguages: string | false;
    is: ( ...args: [ ...string[] ] | string[] ) => string | false | null;
    type: string;
    get: ( field: string ) => string;
    inspect: () => unknown;
    toJSON: () => Record<string, unknown>;
}
