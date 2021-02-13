/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/context.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/05/2021
 * Description:
 ******************************************************************/
/// <reference types="node" />
import { Socket } from 'net';
import { IncomingMessage, ServerResponse } from 'http';
import { ParsedUrlQuery } from 'querystring';
import { Accepts } from 'accepts';
import httpErrors from 'http-errors';
import { Request, RequestOptions } from './request';
import { Response, ResponseOptions } from './response';
import { Headers } from './interfaces';
export interface ContextOptions {
    request: Omit<RequestOptions, 'ctx'>;
    response?: Omit<ResponseOptions, 'ctx'>;
    app?: any;
}
export default class Context {
    app?: any;
    req?: IncomingMessage;
    res?: ServerResponse;
    request: Request;
    response: Response;
    assert: any;
    constructor(options: ContextOptions);
    /**
     * Throw an error with `status` (default 500) and `msg`.
     * Note that these are user-level errors, and the message may be exposed to the client.
     */
    throw(...args: Parameters<typeof httpErrors>): void;
    inspect(): Record<string, unknown>;
    toJSON(): Record<string, unknown>;
    attachment(...args: Parameters<Response['attachment']>): void;
    redirect(...args: Parameters<Response['redirect']>): void;
    remove(...args: Parameters<Response['remove']>): void;
    has(...args: Parameters<Response['has']>): ReturnType<Response['has']>;
    set(...args: Parameters<Response['set']>): void;
    append(...args: Parameters<Response['append']>): void;
    flushHeaders(): void;
    get status(): number;
    set status(code: number);
    get message(): string;
    set message(msg: string);
    get body(): unknown;
    set body(val: unknown);
    get length(): number | undefined;
    set length(n: number | undefined);
    get type(): string;
    set type(type: string);
    get lastModified(): Date | undefined;
    set lastModified(val: Date | undefined);
    get etag(): string;
    set etag(val: string);
    get headerSent(): boolean;
    get writable(): boolean;
    acceptsLanguages(...args: Parameters<Request['acceptsLanguages']>): ReturnType<Request['acceptsLanguages']>;
    acceptsEncodings(...args: Parameters<Request['acceptsEncodings']>): ReturnType<Request['acceptsEncodings']>;
    acceptsCharsets(...args: Parameters<Request['acceptsCharsets']>): ReturnType<Request['acceptsCharsets']>;
    accepts(...args: Parameters<Request['accepts']>): ReturnType<Request['accepts']>;
    get(field: string): string;
    is(...args: Parameters<Request['is']>): ReturnType<Request['is']>;
    get querystring(): string;
    set querystring(str: string);
    get idempotent(): boolean;
    get socket(): Socket | null;
    get search(): string;
    set search(str: string);
    get method(): string;
    set method(method: string);
    get query(): ParsedUrlQuery;
    get path(): string;
    set path(pathname: string);
    get url(): string;
    get accept(): Accepts;
    set accept(accepts: Accepts);
    get origin(): string;
    get href(): string;
    get subdomains(): string[];
    get protocol(): string;
    get host(): string;
    get hostname(): string;
    get URL(): URL;
    get headers(): Headers;
    get secure(): boolean;
    get stale(): boolean;
    get fresh(): boolean;
    get ips(): string[];
    get ip(): string;
}
