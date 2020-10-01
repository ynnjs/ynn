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
import { URL } from 'url';
import accepts from 'accepts';
import contentType from 'content-type';
import qs from 'querystring';
import parseurl from 'parseurl';
import fresh from 'fresh';
import typeis from 'type-is';

const IP = Symbol( 'ip' );
const ACCEPT = Symbol( 'accept' );

/**
 * Prototype
 */
export default {
    /**
     * Return request header.
     *
     * @return {Object}
     */
    get header(): Record<string, any> {
        return this.req.headers;
    },
    
    /**
     * Set request header.
     */
    set header( val: Record<string, any> ): void {
        this.req.headers = val;
    },

    /**
     * Return request header, alias as request.header
     */
    get headers(): Record<string, any> {
        return this.req.headers;
    },

    /**
     * Set request header, alias as request.header
     */
    set headers( val: Record<string, any> ) {
        this.req.headers = val;
    },

    /**
     * Get request URL
     */
    get url(): string {
        return this.req.url;
    },

    /**
     * Set request URL
     */
    set url( val ): void {
        this.req.url = val;
    },

    /**
     * Get origin of URL
     */
    get origin(): string {
        return `${this.protocol}://${this.host}`;
    },

    /**
     * Get full request URL
     *
     * @return {String}
     */
    get href(): string {
        if( /^https?:\/\//i.test( this.originalUrl ) ) return this.originalUrl;
        return this.origin + this.originalUrl;
    },

    /**
     * Get request method
     */
    get method(): string {
        return this.req.method;
    },

    /**
     * Set request method.
     */
    set method( val: string ): void {
        this.req.method = val;
    },

    /**
     * Get request pathname
     */
    get path(): string {
        return parseurl( this.req ).pathname;
    },

    /**
     * Set pathname, retaining the query string when present.
     */
    set path( path: string ) {
        const url = parseurl( this.req );
        if( url.pathname === path ) return;
        url.pathname = path;
        url.path = null;
        this.url = url.format( url );
    },

    /**
     * Get parsed query string
     */
    get query(): string {
        const str = this.querystring;
        const c = this._querycache = this._querycache || {};
        return c[ str ] || ( c[str] = qs.parse( str ) );
    },

    /**
     * Set query string as an object.
     */
    set query( obj: Record<string, any> ) {
        this.querystring = qs.stringify( obj );
    },

    /**
     * Get query string
     */
    get querystring(): string {
        if( !this.req ) return '';
        return parseurl( this.req ).query || '';
    },

    /**
     * Set query string.
     */
    set querystring( str: string ) {
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
    get search(): string {
        if( !this.querystring ) return '';
        return `?${this.querystring}`;
    },

    /**
     * Set the search string. Same as request.querystring= but included for ubiquity
     */
    set search( str: string ) {
        this.querystring = str;
    },

    /**
     * Parse the "Host" header field host and support X-Forwarded-Host when a proxy is enabled.
     */
    get host(): string {
        let host = this.app.proxy && this.get( 'X-Forwarded-Host' );
        if( !host ) {
            if( this.req.httpVersionMajor >= 2 ) host = this.get( ':authority' );
            if( !host ) host = this.get( 'Host' );
        }
        if( !host ) return '';
        return host.split( /\s*,\s*/, 1 )[ 0 ];
    },

    /**
     * Parse the "Host" header field hostname and support X-Forwarded-Host when a proxy is enabled.
     */
    get hostname(): string {
        const { host } = this;
        if( !host ) return '';
        if( '[' === host[ 0 ] ) return this.URL.hostname || ''; // IPv6
        return host.split( ':', 1 )[ 0 ];
    },

    /**
     * Get WHATWG parsed URL. Lazily memoized
     */
    get URL(): URL | Record<any, any> {
        if( !this.momizedURL ) {
            try {
                this.momizedURL = new URL( `${this.origin}${this.originalUrl || ''}` );
            } catch( e ) {
                this.momizedURL = Object.create( null );
            }
        }
        return this.momizedURL;
    },

    /**
     * Check if the request is fresh, aka "Last-Modified" and/or the "ETag" still match
     */
    get fresh(): boolean {
        const { method } = this;
        const { status } = this.ctx;

        // Get or HEAD for weak freshness validation only
        if( 'GET' !== method && 'HEAD' !== method ) return false;

        // 2xx or 304 as per rfc2616 14.26
        if( ( status > 200 && status < 300 ) || 304 === status ) {
            return fresh( this.header, this.response.header ); 
        }
        return false;
    },

    /**
     * Check if the request is stale, aka "Last-Modified" and/or the "ETag" for the resource has changed.
     */
    get stale(): boolean {
        return !this.fresh;
    },

    /**
     * Check if the request is idempotent
     */
    get idempotent(): boolean {
        return [ 'GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'TRACE' ].includes( this.method );
    },

    /**
     * Return the request socket
     */
    get socket(): Socket {
        return this.req.socket;
    },

    /**
     * Get the charset when present or undefined
     */
    get charset(): string {
        return contentType.parse( this.req )?.parameters?.charset || '';
    },

    /**
     * Return parsed Content-Length when present
     */
    get length(): void | number {
        const len = this.get( 'Content-Length' );
        if( len === '' ) return;
        return ~~len;
    },

    /**
     * Return the protocol string "http" or "https" when requested with TLS.
     * When the proxy setting is enabled the "X-Forwarded-Proto" header field will be trusted.
     * If you're running behind a reverse proxy that supplies https for you this may be enabled.
     */
    get protocol(): string {
        if( this.socket.encrypted ) return 'https';
        if( !this.app.proxy ) return 'http';
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
    get ips(): string[] {
        const { proxy } = this.app;
        const val = this.get( this.app.proxyIpHeader );
        let ips = proxy && val ? val.split( /\s*,\s*/ ) : [];
        if( this.app.maxIpsCount > 0 ) {
            ips = ips.slice( -this.app.maxIpsCount );
        }
        return ips;
    },

    /**
     * Return request's remote address.
     * When `app.trustXRealIp` is `true`, try getting the "X-Real-IP" first.
     * When `app.proxy` is `true`, parse the "X-Forwarded-For" ip address list and return the first one
     */
    get ip(): string {
        if( !this[ IP ] ) {
            if( this.app.trustXRealIp ) {
                if( !( this[ IP ] = this.get( 'X-Real-IP' ) ) ) {
                    this[ IP ] = this.ips[ 0 ] || this.socket.remoteAddress || '';
                }
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
    get subdomains(): string[] {
        const offset = this.app.subdomainOffset;
        const { hostname } = this.hostname;
        if( net.isIP( hostname ) ) return [];
        return hostname.split( '.' ).reverse().slice( offset );
    },

    /**
     * Get accept object. Lazily memoized.
     */
    get accept() {
        return this[ ACCEPT ] ||= accepts( this.req );
    },

    /**
     * Set accept object
     */
    set accept( obj: Record<string, any> ): void {
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
    accepts( ...args: Array<string | string[]> ): boolean | string | string[] {
        return this.accept.types( ...args );
    },

    /**
     * Return accepted encodings or best fit based on `encodings`.
     *
     * Given `Accept-Encoding: gzip, deflate`
     * an array sorted by quality is returned: [ 'gzip', 'deflate' ]
     */
    acceptsEncodings( ...args: Array<string | string[]> ): string | string[] {
        return this.accept.encodings( ...args );
    },

    /**
     * Return accepted charsets or best fit based on `charsets`.
     *
     * Given `Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5`
     * an array sorted by quality is required: [ 'utf-8', 'utf-7', 'iso-8859-1' ]
     */
    acceptsCharsets( ...args: Array<string | string[]> ): string | string[] {
        return this.accept.charsets( ...args );
    },

    /**
     * Return accepted languages or best fit based on `langs`
     *
     * Given `Accept-Language: en;q=0.8, es, pt`
     * an array sorted by quality is returned: [ 'es', 'pt', 'en' ]
     */
    acceptsLanguages( ...args: Array<string | string[]> ): string | string[] {
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
    is( type: string | string[], ...types: Array<string | string[]> ): string | false | null {
        return typeis( this.req, type, ...types );
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
        switch( field = field.toLowerCalse() ) {
            case 'referer':
            case 'referrer':
                return this.req.headers.referrer || this.req.headers.referer || '';
            default:
                return this.req.headers[ field ] || '';
        }
    },

    /**
     * Inspact implementation.
     */
    inspect(): Record<string, any> | void {
        if( !this.req ) return;
        return this.toJSON();
    },

    [ util.inspect.custom ](): Record<string, any> | void {
        return this.inspect();
    },

    /**
     * Return JSON.representation.
     */
    toJSON(): Record<string, any> {
        return {
            method : this.method,
            url : this.url,
            header : this.header
        }
    }
}
