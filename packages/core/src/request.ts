/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/request.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/07/2021
 * Description:
 ******************************************************************/

import util from 'util';
import qs, { ParsedUrlQuery } from 'querystring';
import { Socket, isIP } from 'net';
import { IncomingMessage, IncomingHttpHeaders } from 'http';
import { format as stringify, UrlWithStringQuery } from 'url';
import contentType from 'content-type';
import { is } from 'type-is';
import accepts, { Accepts } from 'accepts';
import { Context, Request as RequestInterface } from '@ynn/common';
import { parseurl } from './util/parseurl';

export interface RequestOptions {
    ctx: Context;
    url?: string;
    method?: string;
    req?: IncomingMessage;
    ip?: string;
    body?: unknown;
    headers?: IncomingHttpHeaders;
    trustXRealIp?: boolean;
    proxyIpHeader?: string;
    subdomainOffset?: number;
    httpVersionMajor?: number;
    proxy?: boolean;
    maxIpsCount?: number;
}

export class Request implements RequestInterface {

    #ip?: string;
    #accept?: Accepts;
    #headers: IncomingHttpHeaders = {};
    #parsedurl: UrlWithStringQuery | null = null;
    #rawParsedurl: string | null = null;
    #memoizedURL: URL | null = null;
    #querycache: Record<string, ParsedUrlQuery> = {};

    ctx: Context;
    url = '/';
    method = 'GET';
    originalUrl: string;
    body: unknown = undefined;
    httpVersionMajor = 1;
    proxyIpHeader = 'X-Forwarded-For';
    trustXRealIp = false;
    subdomainOffset = 2;
    proxy = false;
    maxIpsCount?: number;

    req?: IncomingMessage;

    constructor( options: Readonly<RequestOptions> ) {
        const { req } = options;
        this.ctx = options.ctx;

        if( req ) {
            this.req = req;
            req.headers && ( this.headers = req.headers );
            req.method && ( this.method = req.method );
            req.url && ( this.url = req.url );
            this.httpVersionMajor = req.httpVersionMajor;
        } else {
            options.headers && ( this.headers = options.headers );
            options.method && ( this.method = options.method );
            options.url && ( this.url = options.url );
            options.httpVersionMajor && ( this.httpVersionMajor = options.httpVersionMajor );
        }

        options.maxIpsCount !== undefined && ( this.maxIpsCount = options.maxIpsCount );
        options.proxy && ( this.proxy = options.proxy );
        options.ip && ( this.#ip = options.ip );
        options.body === undefined || ( this.body = options.body );
        options.proxyIpHeader && ( this.proxyIpHeader = options.proxyIpHeader );
        options.trustXRealIp === undefined || ( this.trustXRealIp = options.trustXRealIp );
        options.subdomainOffset === undefined || ( this.subdomainOffset = options.subdomainOffset );

        this.originalUrl = this.url;
    }

    #parseurl = (): UrlWithStringQuery => {
        if( !this.#parsedurl || this.url !== this.#rawParsedurl ) {
            this.#rawParsedurl = this.url;
            this.#parsedurl = parseurl( this.url );
        }

        return this.#parsedurl;
    };

    get headers(): IncomingHttpHeaders {
        return this.#headers;
    }

    set headers( headers: IncomingHttpHeaders ) {
        this.#headers = {};

        /**
         * keep all names of headers to be lowercase
         */
        Object.keys( headers ).forEach( ( name: string ): void => {
            this.#headers[ name.toLowerCase() ] = headers[ name ];
        } );
    }

    /**
     * Get origin of URL
     */
    get origin(): string {
        return `${this.protocol}://${this.host}`;
    }

    /**
     * Get full request URL
     */
    get href(): string {
        if( /^https?:\/\//i.test( this.originalUrl ) ) return this.originalUrl;
        return this.origin + this.originalUrl;
    }

    get path(): string {
        return this.#parseurl().pathname ?? '';
    }

    set path( pathname: string ) {
        const url = this.#parseurl();
        if( url.pathname === pathname ) return;
        url.pathname = pathname;
        this.url = stringify( url );
    }

    get query(): ParsedUrlQuery {
        const str = this.querystring;
        return this.#querycache[ str ] ??= qs.parse( str );
    }

    get querystring(): string {
        return this.#parseurl().query ?? '';
    }

    set querystring( str: string ) {
        const url = this.#parseurl();
        url.search = str;
        this.url = stringify( url );
    }

    get search(): string {
        return this.#parseurl().search ?? '';
    }

    set search( str: string ) {
        const url = this.#parseurl();
        url.search = str;
        this.url = stringify( url );
    }

    get host(): string {
        let host = this.proxy && this.get( 'X-Forwarded-Host' );

        if( !host ) {
            /**
             * support ":authority" Psudo-Header defined in HTTP2
             * https://tools.ietf.org/html/rfc7540#section-8.1.2.3
             */
            if( this.httpVersionMajor >= 2 ) host = this.get( ':authority' );
            if( !host ) host = this.get( 'Host' );
        }

        if( !host ) return '';
        return host.split( /\s*,\s*/, 1 )[ 0 ];
    }

    get hostname(): string {
        const { host } = this;
        if( !host ) return '';
        if( host[ 0 ].startsWith( '[' ) ) return this.URL.hostname || ''; // IPv6
        return host.split( ':', 1 )[ 0 ];
    }

    /**
     * Get WHATWG parsed URL
     */
    get URL(): URL {
        if( !this.#memoizedURL ) {
            try {
                this.#memoizedURL = new URL( `${this.origin}${this.originalUrl}` );
            } catch( e: unknown ) {
                this.#memoizedURL = Object.create( null );
            }
        }
        return this.#memoizedURL as URL;
    }

    // @@todo
    get fresh(): boolean { // eslint-disable-line class-methods-use-this
        return true;
    }

    get stale(): boolean {
        return !this.fresh;
    }

    get idempotent(): boolean {
        return [ 'GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'TRACE' ].includes( this.method );
    }

    get socket(): Socket | null {
        return this.req?.socket ?? null;
    }

    /**
     * Get the charset when present or undefined
     */
    get charset(): string {
        try {
            return contentType.parse( this.get( 'Content-Type' ) ).parameters.charset || '';
        } catch( e: unknown ) {
            return '';
        }
    }

    /**
     * Return parsed `Content-Length` as a number when present, or `undefined`.
     */
    get length(): number | undefined {
        const len = this.get( 'Content-Length' );
        if( len === '' ) return undefined;
        return ~~len;
    }

    get protocol(): string {
        if( ( this.socket as TLSSocket )?.encrypted ) return 'https';
        if( !this.proxy ) return 'http';
        return this.get( 'X-Forwarded-Proto' ).split( /\s*,\s*/, 1 )[ 0 ] ?? 'http';
    }


    /**
     * Shorthand for: this.protocol === 'https'.
     */
    get secure(): boolean {
        return this.protocol === 'https';
    }

    /**
     * Get IP addresses listed in `X-Forwarded-For` and support the proxy rules in Koa.
     */
    get ips(): string[] {
        const val = this.get( this.proxyIpHeader );
        if( !val || !this.proxy ) return [];
        const ips = val.split( /\s*,\s*/ );
        if( this.maxIpsCount && this.maxIpsCount > 0 ) return ips.slice( -this.maxIpsCount );
        return ips;
    }

    /**
     * Return request's remote address
     *
     * support `proxy` property like Koa, and use `X-Real-IP` if `trustXRealIp` is true.
     */
    get ip(): string {
        if( this.#ip ) return this.#ip;
        if( this.trustXRealIp && this.get( 'X-Real-IP' ) ) {
            return this.#ip = this.get( 'X-Real-IP' );
        }
        return this.#ip = this.ips[ 0 ] || ( this.socket?.remoteAddress ?? '' ) ;
    }

    set ip( ip: string ) {
        this.#ip = ip;
    }

    /**
     * Return subdomains as an array
     */
    get subdomains(): string[] {
        const { hostname } = this;
        if( isIP( hostname ) ) return [];
        return hostname.split( '.' ).reverse().slice( this.subdomainOffset );
    }

    get accept(): Accepts {
        /**
         * accepts needs IncomingMessage
         * but only the headers property is being used.
         */
        return this.#accept ||= accepts( { headers : this.headers } as IncomingMessage );
    }

    set accept( accepts: Accepts ) {
        this.#accept = accepts;
    }

    accepts( ...args: [ ...string[] ] | string[] ): string[] | string | false {
        return this.accept.types( ...args );
    }

    acceptsEncodings( ...args: [ ...string[] ] | string[] ): string | false {
        return this.accept.encodings( ...args );
    }

    acceptsCharsets( ...args: [ ...string[] ] | string[] ): string | false {
        return this.accept.charsets( ...args );
    }

    acceptsLanguages( ...args: [ ...string[] ] | string[] ): string | false {
        return this.accept.languages( ...args );
    }

    is( ...args: [ ...string[] ] | string[] ): string | false | null {
        if( this.get( 'Transfer-Encoding' ) === '' && isNaN( Number( this.get( 'Content-Length' ) ) ) ) return null;
        return is( this.get( 'Content-Type' ), ...args );
    }

    get type(): string {
        const type = this.get( 'Content-Type' );
        if( !type ) return '';
        return type.split( ';' )[ 0 ];
    }

    get( field: string ): string {
        switch( field = field.toLowerCase() ) {
            case 'referer' :
            case 'referrer' :
                return this.headers.referrer as string ?? this.headers.referer ?? '';
            default :
                return this.headers[ field ] as string ?? '';
        }
    }

    inspect(): Record<string, unknown> {
        return this.toJSON();
    }

    toJSON(): Record<string, unknown> {
        return {
            url : this.url,
            method : this.method,
            headers : this.headers
        };
    }

    [ util.inspect.custom ](): Record<string, unknown> {
        return this.inspect();
    }
}
