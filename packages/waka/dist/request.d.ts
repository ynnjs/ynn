/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/request.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/07/2021
 * Description:
 ******************************************************************/
/// <reference types="node" />
import util from 'util';
import { ParsedUrlQuery } from 'querystring';
import { Socket } from 'net';
import { TLSSocket } from 'tls';
import { IncomingMessage } from 'http';
import { Accepts } from 'accepts';
import Context from './context';
import { Headers } from './interfaces';
export interface RequestOptions {
    ctx: Context;
    url: string;
    method: string;
    req?: IncomingMessage;
    ip?: string;
    headers?: Headers;
    trustXRealIp?: boolean;
    proxyIpHeader?: string;
    subdomainOffset?: number;
    httpVersionMajor?: number;
}
export declare class Request {
    #private;
    ctx: Context;
    url: string;
    originalUrl: string;
    method: string;
    httpVersionMajor: number;
    proxyIpHeader: string;
    trustXRealIp: boolean;
    subdomainOffset: number;
    req?: IncomingMessage;
    constructor(options: Readonly<RequestOptions>);
    get headers(): Headers;
    set headers(headers: Headers);
    /**
     * Get origin of URL
     */
    get origin(): string;
    /**
     * Get full request URL
     */
    get href(): string;
    get path(): string;
    set path(pathname: string);
    get query(): ParsedUrlQuery;
    get querystring(): string;
    set querystring(str: string);
    get search(): string;
    set search(str: string);
    get host(): string;
    get hostname(): string;
    /**
     * Get WHATWG parsed URL
     */
    get URL(): URL;
    get fresh(): boolean;
    get stale(): boolean;
    get idempotent(): boolean;
    get socket(): Socket | TLSSocket | null;
    /**
     * Get the charset when present or undefined
     */
    get charset(): string;
    /**
     * Return parsed `Content-Length` as a number when present, or `undefined`.
     */
    get length(): number | undefined;
    get protocol(): string;
    /**
     * Shorthand for: this.protocol === 'https'.
     */
    get secure(): boolean;
    /**
     * Get IP addresses listed in `X-Forwarded-For` and support the proxy rules in Koa.
     */
    get ips(): string[];
    /**
     * Return request's remote address
     *
     * support `app.proxy` property of Koa, and use `X-Real-IP` if `trustXRealIp` is true.
     */
    get ip(): string;
    set ip(ip: string);
    /**
     * Return subdomains as an array
     */
    get subdomains(): string[];
    get accept(): Accepts;
    set accept(accepts: Accepts);
    accepts(...args: [...string[]] | string[]): string[] | string | false;
    acceptsEncodings(...args: [...string[]] | string[]): string | false;
    acceptsCharsets(...args: [...string[]] | string[]): string | false;
    acceptsLanguages(...args: [...string[]] | string[]): string | false;
    is(...args: [...string[]] | string[]): string | false | null;
    get type(): string;
    get(field: string): string;
    inspect(): Record<string, unknown>;
    toJSON(): Record<string, unknown>;
    [util.inspect.custom](): Record<string, unknown>;
}
