/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/response.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/09/2021
 * Description:
 ******************************************************************/
/// <reference types="node" />
import util from 'util';
import { Socket } from 'net';
import { ServerResponse } from 'http';
import { Options as ContentDispositionOptions } from 'content-disposition';
import Context from './context';
import { Headers } from './interfaces';
export interface ResponseOptions {
    ctx: Context;
    res?: ServerResponse;
    headers?: Headers;
    statusCode?: number;
    statusMessage?: string;
}
export declare class Response {
    #private;
    ctx: Context;
    statusCode: number;
    statusMessage: string;
    res?: ServerResponse;
    EXPLICIT_STATUS: boolean;
    EXPLICIT_NULL_BODY: boolean;
    constructor(options: Readonly<ResponseOptions>);
    get socket(): Socket | null;
    /**
     * Get all set response headers
     */
    get headers(): Headers;
    /**
     * Set response headers
     */
    set headers(headers: Headers);
    /**
     * Get response status code
     */
    get status(): number;
    /**
     * Set response status code
     */
    set status(code: number);
    /**
     * Get response status message
     */
    get message(): string;
    /**
     * Set response status message
     */
    set message(msg: string);
    /**
     * Get response body
     */
    get body(): unknown;
    /**
     * Set response body
     */
    set body(val: unknown);
    /**
     * Set Content-Length field to n
     */
    set length(n: number | undefined);
    /**
     * Return parsed response Content-Length when present.
     */
    get length(): number | undefined;
    /**
     * Check if a header has been written to the socket.
     */
    get headerSent(): boolean;
    /**
     * Vary on `field`
     */
    vary(): void;
    /**
     * Perform a 302 redirect to `url`.
     */
    redirect(url: string, alt?: string): void;
    /**
     * Set Content-Disposition header to "attachment" with optional `filename`( ...args );
     */
    attachment(filename?: string, options?: ContentDispositionOptions): void;
    /**
     * Set Content-Type response header with `type` through `mime.lookup()`
     */
    set type(type: string);
    /**
     * Return the response mime type void of parameters such as "charset".
     */
    get type(): string;
    /**
     * Set the Last-Modified date using a string or a Date.
     */
    set lastModified(val: Date | undefined);
    /**
     * Get the Last-Modified date in Date form, if it exists
     */
    get lastModified(): Date | undefined;
    /**
     * Set the ETag of a response
     */
    set etag(val: string);
    /**
     * Get the ETag of a response
     */
    get etag(): string;
    /**
     * Check whether the response is one of the listed types.
     * Pretty much the same as `this.request.is()`.
     */
    is(...args: [...string[]] | string[]): string | false | null;
    /**
     * Return response header.
     */
    get(field: string): string;
    /**
     * Returns true if the header identified by name is currently set in the outgoing headers.
     * The header name matching is case-insensitive.
     */
    has(field: string): boolean;
    /**
     * Set header `field` to `val` or pass an object of header fields
     */
    set(field: string | Headers, val?: string | number | (string | number)[]): void;
    /**
     * Append additional header `field` with value `val`.
     */
    append(field: string, val: string | number | (string | number)[]): void;
    /**
     * Remove header `field`
     */
    remove(field: string): void;
    /**
     * Checks if the request if writable.
     * Tests for the existence of the socket
     * as node sometimes does not set it.
     */
    get writable(): boolean;
    /**
     * Inspect implementation
     */
    inspect(): Record<string, unknown>;
    /**
     * Return JSON representation
     */
    toJSON(): Record<string, unknown>;
    /**
     * Flush any set headers and begin the body
     */
    flushHeaders(): void;
    [util.inspect.custom](): Record<string, unknown>;
}
