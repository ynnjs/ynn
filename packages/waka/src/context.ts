/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/context.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/05/2021
 * Description:
 ******************************************************************/

import { Socket } from 'net';
import { IncomingMessage, ServerResponse, IncomingHttpHeaders } from 'http';
import { ParsedUrlQuery } from 'querystring';
import { Accepts } from 'accepts';
import httpErrors from 'http-errors';
import httpAssert from 'http-assert';
import { Request, RequestOptions } from './request';
import { Response, ResponseOptions } from './response';
import Application from './application';
// import Cookies, { SetOption as CookieOptions } from 'cookies';

export interface ContextOptions {
    request: Omit<RequestOptions, 'ctx'>;
    response?: Omit<ResponseOptions, 'ctx'>;
    app: Application;
}

export default class Context {

    app: Application;
    req?: IncomingMessage;
    res?: ServerResponse;

    request: Request;
    response: Response;

    params: Record<string, string> = {};
    matches: [ string | undefined ][] = [];

    assert = httpAssert;

    constructor( options: ContextOptions ) {
        this.app = options.app;
        this.request = new Request( { ...options.request, ctx : this } );
        this.response = new Response( { ...( options.response ?? {} ), ctx : this } );
        this.request.req && ( this.req = this.request.req );
        this.response.res && ( this.res = this.response.res );

    }

    /**
     * Throw an error with `status` (default 500) and `msg`.
     * Note that these are user-level errors, and the message may be exposed to the client.
     */
    throw( ...args: Parameters<typeof httpErrors> ): void { // eslint-disable-line class-methods-use-this
        throw httpErrors( ...args );
    }

    inspect(): Record<string, unknown> {
        return this.toJSON();
    }

    toJSON(): Record<string, unknown> {
        return {
            request : this.request.toJSON(),
            resposne : this.response.toJSON(),
            app : this.app?.toJSON() || null
        };
    }

    // get cookies(): Cookies {}
    // set cookies() {}

    attachment( ...args: Parameters<Response[ 'attachment' ]> ): void {
        this.response.attachment( ...args );
    }

    redirect( ...args: Parameters<Response[ 'redirect' ]> ): void {
        this.response.redirect( ...args );
    }

    remove( ...args: Parameters<Response[ 'remove' ]> ): void {
        this.response.remove( ...args );
    }

    // vary() {}

    has( ...args: Parameters<Response[ 'has' ]> ): ReturnType<Response[ 'has' ]> {
        return this.response.has( ...args );
    }

    set( ...args: Parameters<Response[ 'set' ]> ): void {
        this.response.set( ...args );
    }

    append( ...args: Parameters<Response[ 'append' ]> ): void {
        this.response.append( ...args );
    }

    flushHeaders(): void {
        this.response.flushHeaders();
    }

    get status(): number {
        return this.response.status;
    }

    set status( code: number ) {
        this.response.status = code;
    }

    get message(): string {
        return this.response.message;
    }

    set message( msg: string ) {
        this.response.message = msg;
    }

    get body(): unknown {
        return this.response.body;
    }

    set body( val: unknown ) {
        this.response.body = val;
    }

    get length(): number | undefined {
        return this.response.length;
    }

    set length( n: number | undefined ) {
        this.response.length = n;
    }

    get type(): string {
        return this.response.type;
    }

    set type( type: string ) {
        this.response.type = type;
    }

    get lastModified(): Date | undefined {
        return this.response.lastModified;
    }

    set lastModified( val: Date | undefined ) {
        this.response.lastModified = val;
    }

    get etag(): string {
        return this.response.etag;
    }

    set etag( val: string ) {
        this.response.etag = val;
    }

    get headerSent(): boolean {
        return this.response.headerSent;
    }

    get writable(): boolean {
        return this.response.writable;
    }

    acceptsLanguages( ...args: Parameters<Request[ 'acceptsLanguages' ]> ): ReturnType<Request[ 'acceptsLanguages' ]> {
        return this.request.acceptsLanguages( ...args );
    }

    acceptsEncodings( ...args: Parameters<Request[ 'acceptsEncodings' ]> ): ReturnType<Request[ 'acceptsEncodings' ]> {
        return this.request.acceptsEncodings( ...args );
    }

    acceptsCharsets( ...args: Parameters<Request[ 'acceptsCharsets' ]> ): ReturnType<Request[ 'acceptsCharsets' ]> {
        return this.request.acceptsCharsets( ...args );
    }

    accepts( ...args: Parameters<Request[ 'accepts' ]> ): ReturnType<Request[ 'accepts' ]> {
        return this.request.accepts( ...args );
    }

    get( field: string ): string {
        return this.request.get( field );
    }

    is( ...args: Parameters<Request[ 'is' ]> ): ReturnType<Request[ 'is' ]> {
        return this.request.is( ...args );
    }

    get querystring(): string {
        return this.request.querystring;
    }

    set querystring( str: string ) {
        this.request.querystring = str;
    }

    get idempotent(): boolean {
        return this.request.idempotent;
    }

    get socket(): Socket | null {
        return this.request.socket;
    }

    get search(): string {
        return this.request.search;
    }

    set search( str: string ) {
        this.request.search = str;
    }

    get method(): string {
        return this.request.method;
    }

    set method( method: string ) {
        this.request.method = method;
    }

    get query(): ParsedUrlQuery {
        return this.request.query;
    }

    get path(): string {
        return this.request.path;
    }

    set path( pathname: string ) {
        this.request.path = pathname;
    }

    get url(): string {
        return this.request.url;
    }

    get accept(): Accepts {
        return this.request.accept;
    }

    set accept( accepts: Accepts ) {
        this.request.accept = accepts;
    }

    get origin(): string {
        return this.request.origin;
    }

    get href(): string {
        return this.request.href;
    }

    get subdomains(): string[] {
        return this.request.subdomains;
    }

    get protocol(): string {
        return this.request.protocol;
    }

    get host(): string {
        return this.request.host;
    }

    get hostname(): string {
        return this.request.hostname;
    }

    get URL(): URL {
        return this.request.URL;
    }

    get headers(): IncomingHttpHeaders {
        return this.request.headers;
    }

    get secure(): boolean {
        return this.request.secure;
    }

    get stale(): boolean {
        return this.request.stale;
    }

    get fresh(): boolean {
        return this.request.fresh;
    }

    get ips(): string[] {
        return this.request.ips;
    }

    get ip(): string {
        return this.request.ip;
    }
}
