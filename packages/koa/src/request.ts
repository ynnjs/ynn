/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/request.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 09/30/2020
 * Description: 
 ******************************************************************/

import util from 'util';
import net, { Socket } from 'net';
import { TLSSocket } from 'tls';
import { IncomingMessage, IncomingHttpHeaders } from 'http';
import { Http2ServerRequest } from 'http2';
import { URL } from 'url';
import accepts from 'accepts';
import contentType from 'content-type';
import qs from 'querystring';
import parseurl from 'parseurl';
import fresh from 'fresh';
import typeis from 'type-is';
import Koa from './application';
import { KoaContext } from './context';
import { KoaResponse } from './response';

const IP = Symbol( 'ip' );
const ACCEPT = Symbol( 'accept' );
const QUERY_CACHE = Symbol( 'query#cache' );
const MOMIZED_URL = Symbol( 'momized#url' );

export type KoaRequestQuery = Record<string, any>;

export interface KoaRequest {
    URL: URL | Record<any, any>;
    [ MOMIZED_URL ]?: URL | Record<any, any>;
    [ QUERY_CACHE ]?: Record<string, KoaRequestQuery>;
    [ util.inspect.custom ]: () => Record<string, any> | void;
    accept: Record<string, any>;
    accepts: ( ...args: Array<string | string[]> ) => boolean | string | string[];
    acceptsCharsets: ( ...args: Array<string | string[]> ) => string | string[];
    acceptsEncodings: ( ...args: Array<string | string[]> ) => string | string[];
    acceptsLanguages: ( ...args: Array<string | string[]> ) => string | string[];
    app?: Koa;
    charset: string;
    ctx?: KoaContext;
    fresh: boolean;
    get: ( field: string ) => string;
    header: IncomingHttpHeaders;
    headers: IncomingHttpHeaders;
    host: string;
    hostname: string;
    href: string;
    idempotent: boolean;
    inspect: () => Record<string, any> | void;
    ip: string;
    ips: string[];
    is: ( ( ...types: Array<string | string[]> ) => string | false | null )
        | ( ( types: string[] ) => string | false | null );
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
const Request: KoaRequest = {

    /**
     * Return request headers
     * Request headers is a read-only property in Http2ServerRequest.
     */
    get header() {
        return this.headers;
    },

    set header( header ) {
        this.headers = header;
    },

    get headers() {
        return this.req!.headers;
    },

    set headers( headers ) {
        ( this.req! as IncomingMessage ).headers = headers;
    },

    /**
     * Get request URL
     * Property url is readonly in Http2ServerRequest
     */
    get url() {
        return this.req!.url;
    },

    set url( val ) {
        ( this.req! as IncomingMessage ).url = val;
    },

    /**
     * Get origin of URL
     */
    get origin() {
        return `${this.protocol}://${this.host}`;
    },

    /**
     * Get full request URL
     *
     * @return {String}
     */
    get href() {
        if( /^https?:\/\//i.test( this.originalUrl! ) ) return this.originalUrl!;
        return this.origin + this.originalUrl!;
    },

    /**
     * Get request method
     *
     * Property method is readonly in Http2ServerRequest
     */
    get method() {
        return this.req!.method || '';
    },

    set method( val ) {
        ( this.req! as IncomingMessage ).method = val;
    },

    /**
     * Get request pathname
     */
    get path() {
        return parseurl( this.req ).pathname;
    },

    /**
     * Set pathname, retaining the query string when present.
     */
    set path( path ) {
        const url = parseurl( this.req );
        if( url.pathname === path ) return;
        url.pathname = path;
        url.path = null;
        this.url = url.format( url );
    },

    /**
     * Get parsed query string
     */
    get query() {
        const str = this.querystring;
        const c = ( this[ QUERY_CACHE ] ||= {} );
        return c[ str ] || ( c[str] = qs.parse( str ) );
    },

    /**
     * Set query string as an object.
     */
    set query( obj ) {
        this.querystring = qs.stringify( obj );
    },

    /**
     * Get query string
     */
    get querystring() {
        if( !this.req ) return '';
        return parseurl( this.req ).query || '';
    },

    /**
     * Set query string.
     */
    set querystring( str ) {
        const url = parseurl( this.req );
        if( url.search === `?${str}` ) return;
        url.search = str;
        url.path = null;
        this.url = url.format( url );
    },

    /**
     * Get the search string. Same as the query string.
     * except it includes the leading ?.
     */
    get search() {
        if( !this.querystring ) return '';
        return `?${this.querystring}`;
    },

    /**
     * Set the search string. Same as request.querystring= but included for ubiquity
     */
    set search( str ) {
        this.querystring = str;
    },

    /**
     * Parse the "Host" header field host and support X-Forwarded-Host when a proxy is enabled.
     */
    get host() {
        let host = this.app!.proxy && this.get( 'X-Forwarded-Host' );
        if( !host ) {
            if( this.req!.httpVersionMajor >= 2 ) host = this.get( ':authority' );
            if( !host ) host = this.get( 'Host' );
        }
        if( !host ) return '';
        return host.split( /\s*,\s*/, 1 )[ 0 ];
    },

    /**
     * Parse the "Host" header field hostname and support X-Forwarded-Host when a proxy is enabled.
     */
    get hostname() {
        const { host } = this;
        if( !host ) return '';
        if( '[' === host[ 0 ] ) return this.URL.hostname || ''; // IPv6
        return host.split( ':', 1 )[ 0 ];
    },

    /**
     * Get WHATWG parsed URL. Lazily memoized
     */
    get URL() {
        if( !this[ MOMIZED_URL ] ) {
            try {
                this[ MOMIZED_URL ] = new URL( `${this.origin}${this.originalUrl! || ''}` );
            } catch( e ) {
                this[ MOMIZED_URL ] = Object.create( null );
            }
        }
        return this[ MOMIZED_URL ]!;
    },

    /**
     * Check if the request is fresh, aka "Last-Modified" and/or the "ETag" still match
     */
    get fresh() {
        const { method } = this;
        const { status } = this.ctx!;

        // Get or HEAD for weak freshness validation only
        if( 'GET' !== method && 'HEAD' !== method ) return false;

        // 2xx or 304 as per rfc2616 14.26
        if( ( status >= 200 && status < 300 ) || 304 === status ) {
            return fresh( this.headers, this.response!.headers ); 
        }
        return false;
    },

    /**
     * Check if the request is stale, aka "Last-Modified" and/or the "ETag" for the resource has changed.
     */
    get stale() {
        return !this.fresh;
    },

    /**
     * Check if the request is idempotent
     */
    get idempotent() {
        return [ 'GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'TRACE' ].includes( this.method );
    },

    /**
     * Return the request socket
     */
    get socket() {
        return this.req!.socket;
    },

    /**
     * Get the charset when present or undefined
     */
    get charset() {
        try {
            return contentType.parse( this.req! ).parameters.charset || '';
        } catch( e ) {
            return '';
        }
    },

    /**
     * Return parsed Content-Length when present
     */
    get length() {
        const len = this.get( 'Content-Length' );
        if( len === '' ) return;
        return ~~len;
    },

    /**
     * Return the protocol string "http" or "https" when requested with TLS.
     * When the proxy setting is enabled the "X-Forwarded-Proto" header field will be trusted.
     * If you're running behind a reverse proxy that supplies https for you this may be enabled.
     */
    get protocol() {
        if( ( this.socket as TLSSocket ).encrypted ) return 'https';
        if( !this.app!.proxy ) return 'http';
        return this.get( 'X-Forwarded-Proto' )?.split( /\s*,\s*/, 1 )[ 0 ] || 'http';
    },

    /**
     * Shorthand for: this.protocol === 'https';
     */
    get secure(): boolean {
        return 'https' === this.protocol;
    },

    /**
     * When `app.proxy` is `true`, parse the "X-Forwarded-For" ip address list
     *
     * For example if the value was "client, proxy1, proxy2"
     * you would receive the array `[ "client", "proxy1", "proxy2" ]`
     * where "proxy2" is the furthest down-stream.
     */
    get ips() {
        const { proxy } = this.app!;
        const val = this.get( this.app!.proxyIpHeader );
        let ips = proxy && val ? val.split( /\s*,\s*/ ) : [];
        if( this.app!.maxIpsCount > 0 ) {
            ips = ips.slice( -this.app!.maxIpsCount );
        }
        return ips;
    },

    /**
     * Return request's remote address.
     * When `app.trustXRealIp` is `true`, try getting the "X-Real-IP" first.
     * When `app.proxy` is `true`, parse the "X-Forwarded-For" ip address list and return the first one
     */
    get ip() {
        if( !this[ IP ] ) {
            if( this.app!.trustXRealIp ) {
                if( !( this[ IP ] = this.get( 'X-Real-IP' ) ) ) {
                    this[ IP ] = this.ips[ 0 ] || this.socket.remoteAddress || '';
                }
            } else {
                this[ IP ] = this.ips[ 0 ] || this.socket.remoteAddress || '';
            }
        }
        return this[ IP ];
    },

    set ip( ip: string ) {
        this[ IP ] = ip;
    },

    /**
     * Return subdomains as an array.
     *
     * Subdomains are the dot-separated parts of the host before the main domain of the app.
     * By default, the domain of the app is assumed to be tha last two parts of the host.
     * This can be changed by setting `app.subdomainOffset`.
     *
     * For example, if the domain is "tobi.ferrets.example.com":
     * If `app.subdomainOffset` is not set, the subdomains is `[ "ferrets", "tobi" ]`.
     * If `app.subdomainOffset` is 3, the subdomains is `[ "tobi" ]`.
     */
    get subdomains() {
        const offset = this.app!.subdomainOffset;
        const { hostname } = this;
        if( net.isIP( hostname ) ) return [];
        return hostname.split( '.' ).reverse().slice( offset );
    },

    /**
     * Get accept object. Lazily memoized.
     */
    get accept() {
        /**
         * accepts does't support Http2ServerRequest in it's delcaration file
         */
        return this[ ACCEPT ] ||= accepts( this.req! as IncomingMessage );
    },

    /**
     * Set accept object
     */
    set accept( obj: Record<string, any> ) {
        this[ ACCEPT ] = obj;
    },

    /**
     * Check if the given `type(s)` is acceptable, returning the best match when true,
     * otherwise `false`, in which case you should respond with 406 "Not Acceptable".
     *
     * The `type` value may be a single mime type string such as "application/json",
     * the extension name such as "json" or an array `[ "json", "html", "text/plain" ]`.
     * When a list or array is given the _best_ match, if any is returned.
     *
     * Examples:
     *      // Accept: text/html
     *      this.accepts( 'html' );
     *      // => "html"
     *
     *      // Accept: text/*, application/json
     *      this.accepts( 'html' );
     *      // => "html"
     *      this.accpets( 'text/html' );
     *      // => "text/html"
     *      this.accepts( 'json', 'text' );
     *      // => "json"
     *      this.accepts( 'application/json';
     *      // => "application/json"
     *
     *      // Accept: text/*, application/json
     *      this.accepts( 'image/png' );
     *      this.accepts( 'png' );
     *      // => false
     *
     *      // Accept: text/*;q=.5, application/json
     *      this.accepts( [ 'html', 'json' ] );
     *      this.accepts( 'html', 'json' );
     *      // => "json"
     */
    accepts( ...args ) {
        return this.accept.types( ...args );
    },

    /**
     * Return accepted encodings or best fit based on `encodings`.
     *
     * Given `Accept-Encoding: gzip, deflate`
     * an array sorted by quality is returned: [ 'gzip', 'deflate' ]
     */
    acceptsEncodings( ...args ) {
        return this.accept.encodings( ...args );
    },

    /**
     * Return accepted charsets or best fit based on `charsets`.
     *
     * Given `Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5`
     * an array sorted by quality is required: [ 'utf-8', 'utf-7', 'iso-8859-1' ]
     */
    acceptsCharsets( ...args ) {
        return this.accept.charsets( ...args );
    },

    /**
     * Return accepted languages or best fit based on `langs`
     *
     * Given `Accept-Language: en;q=0.8, es, pt`
     * an array sorted by quality is returned: [ 'es', 'pt', 'en' ]
     */
    acceptsLanguages( ...args ) {
        return this.accept.languages( ...args );
    },
    
    /**
     * Check if the incoming request contains the "Content-Type" header field and if it contains any of the given name `type(s)`.
     * If there is no request body, `null` is returned.
     * If there is not content type, `false` is returned.
     * Otherwise, it returns the first `type` that matches.
     *
     * Examples:
     *      // With Content-Type: text/html; charset=utf-8
     *      this.is( 'html' ); // => 'html'
     *      this.is( 'text/html' ); ==> 'text/html';
     *      this.is( 'test/*', 'application/json' ) => 'text/html';
     *
     *      // When Content-Type is application/json
     *      this.is( 'json', 'urlencoded' ); // => 'json'
     *      this.is( 'application/json' ); // => 'application/json'
     *      this.is( 'html', 'application/*' ); // => 'application/json'
     *
     *      this.is( 'html' ); // => false
     */
    is( ...types ) {
        /**
         * typeis doesn't support Http2ServerRequest in it's declaration file.
         */
        return typeis( this.req! as IncomingMessage, ...types );
    },

    /**
     * REturn the request mime type void of parameters such as "charset"
     */
    get type() {
        return this.get( 'Content-Type' )?.split( ';' )[ 0 ] || '';
    },

    /**
     * Return request header..
     *
     * The `Referrer` header field is special-cased, both `Referrer` and `Referer` are interchangeable.
     *
     * Examples:
     *      this.get( 'Content-Type' ); // => "text/plain"
     *      this.get( 'content-type' ); // => "text/plain"
     *      this.get( 'Something' ); // => ""
     */
    get( field: string ): string {
        switch( field = field.toLowerCase() ) {
            case 'referer':
            case 'referrer':
                /**
                 * referrer is not defined in IncomingHttpHeaders
                 * it is able to be string[]
                 * see: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/node/http.d.ts
                 */
                return this.req!.headers.referrer as string || this.req!.headers.referer || '';
            default:
                return this.req!.headers[ field ] as string || '';
        }
    },

    /**
     * Inspact implementation.
     */
    inspect() {
        if( !this.req ) return;
        return this.toJSON();
    },

    [ util.inspect.custom ]() {
        return this.inspect();
    },

    /**
     * Return JSON.representation.
     */
    toJSON(): Record<string, any> {
        return {
            method : this.method,
            url : this.url,
            headers : this.headers
        }
    }
}

export default Request;
