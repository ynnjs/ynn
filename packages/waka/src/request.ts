/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/request.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/07/2021
 * Description:
 ******************************************************************/

import util from 'util';
import { Socket, isIP } from 'net';
import { IncomingMessage } from 'http';
import { parse, format as stringify } from 'url';
import contentType from 'content-type';
import { is } from 'type-is';
import accepts, { Accepts } from 'accepts';
import Context from './context';
import { Queries, Headers } from './interfaces';
import { parseurl } from './util/parseurl';

export interface RequestOptions {
    ctx: Context;
    url: string;
    method: string;
    req?: IncomingMessage;
    ip?: string;
    headers?: Headers;
    httpVersionMajor?: number;
    trustXRealIp?: boolean;
    proxyIpHeader?: string;
    subdomainOffset?: number;
    httpVersionMajor?: number;
}

export class Request {

    #ip?: string;
    #accept?: Accepts;
    #headers: Headers = {};
    #parsedurl: ReturnType<typeof parse> | null = null;
    #rawParsedurl: string | null = null;
    #memoizedURL: URL | null;

    ctx: Context;
    url: string;
    origionalUrl: string;
    method: string;
    httpVersionMajor = 1;
    proxyIpHeader = 'X-Forwarded-For';
    trustXRealIp = false;
    subdomainOffset = 2;

    req?: IncomingMessage;

    constructor( options: Readonly<RequestOptions> = {} ) {
        this.ctx = options.ctx;
        this.url = options.url;
        this.origionalUrl = this.url;
        this.method = options.method;
        options.ip ?? ( this.#ip = options.ip );
        options.req ?? ( this.req = options.req );
        options.trustXRealIp ?? ( this.trustXRealIp = options.trustXRealIp );
        options.proxyIpHeader ?? ( this.proxyIpHeader = options.proxyIpHeader );
        options.subdomainOffset ?? ( this.subdomainOffset = options.subdomainOffset );
        options.httpVersionMajor ?? ( this.httpVersionMajor = options.httpVersionMajor );
        options.headers ?? ( this.#headers = { ...options.headers } );
    }

    #parseurl = (): URL => {
        if( !this.#parsedurl || this.url !== this.#rawParsedurl ) {
            this.#rawParsedurl = this.url;
            this.#parsedurl = parseurl( this.url );
        }

        return this.#parsedurl;
    };

    get headers(): Headers {
        return this.#headers;
    }

    set headers( headers: Headers ) {
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
        return this.#parseurl().pathname;
    }

    set path( pathname: string ) {
        const url = this.#parseurl();
        if( url.pathname === pathname ) return;
        url.pathname = pathname;
        this.url = stringify( url );
    }

    get query(): Queries {
        const query: Queries = {};

        for( const pair of this.#parseurl().searchParams.entries() ) {
            query[ pair[ 0 ] ] = pair[ 1 ];
        }

        return query;
    }

    get querystring(): string {
        return this.#parseurl().searchParams.toString();
    }

    set querystring( str: string ) {
        const url = this.#parseurl();
        url.search = str;
        this.url = stringify( url );
    }

    get search(): string {
        return this.#parseurl().search;
    }

    set search( str: string ) {
        const url = this.#parseurl();
        url.search = str;
        this.url = stringify( url );
    }

    get host(): string {
        /**
         * Compatibility with Koa applications.
         */
        let host = this.ctx.app?.proxy && this.get( 'X-Forwarded-Host' );

        if( !host ) {
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
                this.#memoizedURL = new URL( `${this.origin}${this.origionalUrl}` );
            } catch( e: unknown ) {
                this.#memoizedURL = Object.create( null );
            }
        }
        return this.#memoizedURL;
    }

    // @@todo
    // get fresh() {}

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
            return contentType( this.get( 'Content-Type' ) ).parameters.charset || '';
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
        if( this.socket?.encrypted ) return 'https';
        /**
         * support proxy property of Koa application.
         */
        if( this.ctx.app && !this.ctx.app.proxy ) return 'http';
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
        if( !val || ( this.ctx.app && !this.ctx.app.proxy ) ) return [];
        const ips = val.split( /\s*,\s*/ );
        if( this.ctx.app?.maxIpsCount > 0 ) return ips.slice( -this.ctx.app.maxIpsCount );
        return ips;
    }

    /**
     * Return request's remote address
     *
     * support `app.proxy` property of Koa, and use `X-Real-IP` if `trustXRealIp` is true.
     */
    get ip(): string {
        if( this.#ip ) return this.#ip;
        if( this.truxtXRealIp && this.get( 'X-Real-IP' ) ) {
            return this.#ip = this.get( 'X-Real-IP' );
        }
        return this.#ip = ( this.ips[ 0 ] || ( this.socket?.remoteAddress ?? '' ) );
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
        return this.#accept ||= accepts( { headers : this.headers } );
    }

    set accept( accepts: Accepts ) {
        this.#accept = accepts;
    }

    accepts( ...args: [ string[] ] | string[] ): string[] | string | false {
        return this.accept.types( ...args );
    }

    acceptsEncodings( ...args: [ string[] ] | string[] ): string | false {
        return this.accept.encodings( ...args );
    }

    acceptsCharsets( ...args: [ string[] ] | string[] ): string | false {
        return this.accept.charsets( ...args );
    }

    acceptsLanguages( ...args: [ string[] ] | string[] ): string | false {
        return this.accept.languages( ...args );
    }

    is( ...args: [ string[] ] | string[] ): string | false | null {
        if( this.get( 'Transfer-Encoding' ) === '' && isNaN( this.get( 'Content-Length' ) ) ) return null;
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
                return this.headers.referrer as string || ( this.headers.referer ?? '' );
            default :
                return this.headers[ field ] as string || '';
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
