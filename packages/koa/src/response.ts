/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/response.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/01/2020
 * Description: 
 ******************************************************************/

import path from 'path';
import util from 'util';
import { Socket } from 'net';
import { TLSSocket } from 'tls';
import Stream, { Readable, Writable } from 'stream';
import assert from 'assert';
import { IncomingMessage, ServerResponse, OutgoingHttpHeaders } from 'http';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';
import vary from 'vary';
import statuses from 'statuses';
import encodeurl from 'encodeurl';
import escapehtml from 'escape-html';
import { is as typeis } from 'type-is';
import onFinished from 'on-finished';
import getType from 'cache-content-type';
import contentDisposition, { Options as ContentDispositionOptions } from 'content-disposition';
import { KoaContext } from './context';

const BODY = Symbol( 'body' );
const EXPLICIT_STATUS = Symbol( 'explicit#status' );
const RESPOND_EXPLICIT_NULL_BODY = Symbol.for( 'respond#explicit#null#body' );

export type KoaResponseHeaderValue = OutgoingHttpHeaders[ keyof OutgoingHttpHeaders ];

export type KoaResponseBody = string | null | Buffer | Readable | Writable | Record<any, any>;

export interface KoaResponse {
    [ BODY ]?: KoaResponseBody;
    [ EXPLICIT_STATUS ]?: boolean;
    [ util.inspect.custom ]: () => Record<string, any> | void;
    append: ( field: string, value: string | string[] ) => void;
    attachment: ( filename: string, options: ContentDispositionOptions ) => void;
    body: KoaResponseBody;
    ctx?: KoaContext;
    etag: string;
    flushHeaders: () => void;
    get: ( field: string ) => KoaResponseHeaderValue;
    has: ( field: string ) => boolean;
    header: OutgoingHttpHeaders;
    headerSent: boolean;
    headers: OutgoingHttpHeaders;
    inspect: () => Record<string, any> | void;
    is: ( ( ...types: Array<string | string[]> ) => string | false | null ) | ( ( types: string[] ) => string | false | null );
    length: number | undefined;
    message: string;
    remove: ( field: string ) => void;
    req?: IncomingMessage | Http2ServerRequest;
    res?: ServerResponse | Http2ServerResponse;
    redirect: ( url: string, alt: string ) => void;
    set: ( field: string | Record<string, string | string[]>, val?: KoaResponseHeaderValue ) => void;
    socket: Socket | TLSSocket;
    status: number;
    toJSON: () => Record<string, any>;
    type: string;
    vary: ( field: string ) => void;
    writable: boolean;
    lastModified: Date | undefined;
}

const Response: KoaResponse = {
    /**
     * Return the request socket
     */
    get socket() {
        return this.req!.socket;
    },

    /**
     * Return response headers
     */
    get header() {
        return this.headers;
    },

    get headers() {
        return this.res!.getHeaders() || {};
    },
    
    /**
     * Get response status code
     */
    get status() {
        return this.res!.statusCode;
    },

    /**
     * Set response status code
     */
    set status( code: number ) {
        if( this.headerSent ) return;
        assert( code >= 100 && code <= 999, `invalid status code: ${code}` );
        this[ EXPLICIT_STATUS ] = true;
        this.res!.statusCode = code;
        if( this.req!.httpVersionMajor < 2 ) this.res!.statusMessage = statuses.message[ code ] as string;
        if( this.body && statuses.empty[ code ] ) this.body = null;
    },

    /**
     * Get response status message
     */
    get message() {
        return this.res!.statusMessage || statuses.message[ this.status ] || '';
    },

    /**
     * Set response status message
     */
    set message( msg: string ) {
        this.res!.statusMessage = msg;
    },

    /**
     * Get response body.
     */
    get body() {
        return this[ BODY ]!;
    },

    /**
     * Set response body
     */
    set body( val ) {
        const original = this[ BODY ];
        this[ BODY ]= val;

        // no content
        if( null == val ) {
            if( !statuses.empty[ this.status ] ) this.status = 204;
            if( val === null ) this[ RESPOND_EXPLICIT_NULL_BODY ] = true;
            this.remove( 'Content-Type' );
            this.remove( 'Content-Length' );
            this.remove( 'Transfer-Encoding' );
            return;
        }

        // set the status
        if( !this[ EXPLICIT_STATUS ] ) this.status = 200;

        // set the content-type only if not yet set
        const setType = !this.has( 'Content-Type' );

        // string
        if( 'string' === typeof val ) {
            if( setType ) this.type = /^\s*</.test( val ) ? 'html' : 'text';
            this.length = Buffer.byteLength( val );
            return;
        }

        // buffer
        if( Buffer.isBuffer( val ) ) {
            if( setType ) this.type = 'bin';
            this.length = val.length;
            return;
        }

        // stream
        if( val instanceof Stream ) {
            onFinished( this.res! as ServerResponse, () => ( val as Readable ).destroy() );
            if( original != val ) {
                val.once( 'error', e => this.ctx!.onerror( e ) );
                /// overwriting
                if( null != original ) this.remove( 'Content-Length' );
            }
            if( setType ) this.type = 'bin';
            return;
        }

        // json
        this.remove( 'Content-Length' );
        this.type = 'json';
    },

    /**
     * Set Content-Length field to `n`.
     */
    set length( n: number | undefined ) {
        n !== undefined && this.set( 'Content-Length', String( n as number ) );
    },

    /**
     * Return parsed response Content-Length when present
     */
    get length(): number | undefined {
        if( this.has( 'Content-Length' ) ) {
            return parseInt( this.get( 'Content-Length' ) as string, 10 ) || 0;
        }

        const { body } = this;
        if( !body || body instanceof Stream ) return undefined;
        if( 'string' === typeof body ) return Buffer.byteLength( body );
        if( Buffer.isBuffer( body ) ) return body.length;
        return Buffer.byteLength( JSON.stringify( body ) );
    },

    /**
     * Check if a header has been written to the socket.
     */
    get headerSent() {
        return this.res!.headersSent;
    },

    /**
     * Vary on `field`.
     */
    vary( field ) {
        if( this.headerSent ) return;
        vary( this.res! as ServerResponse, field );
    },

    /**
     * Perform a 302 redirect `url `.
     *
     * The string "back" is special-cased to provide Referrer support,
     * when Referrer is not present `alt` or "/" is used.
     *
     * Examples:
     *      
     *      this.redirect( 'back' );
     *      this.redirect( 'back', '/index.html' );
     *      this.redirect( '/login' );
     *      this.redirect( 'http://google.com' );
     */
    redirect( url, alt ) {
        // location
        if( 'back' === url ) url = this.ctx!.get( 'Referrer' ) || alt || '/';
        this.set( 'Location', encodeurl( url ) );

        // status
        if( !statuses.redirect[ this.status ] ) this.status = 302;

        // html
        if( this.ctx!.accepts( 'html' ) ) {
            url = escapehtml( url );
            this.type = 'text/html; charset=utf-8';
            this.body = `Redirecting to <a href="${url}">${url}</a>.`;
            return;
        }

        // text
        this.type = 'text/plain; charset=utf-8';
        this.body = `Redirecting to ${url}.`;
    },

    /**
     * Set Content-Disposition header to "attachment" with optional `filename`.
     */
    attachment( filename, options ) {
        if( filename ) this.type = path.extname( filename );
        this.set( 'Content-Disposition', contentDisposition( filename, options ) );
    },

    /**
     * Set Content-Type response header with `type` through `mime.lookup()`
     * when it does not contain a charset.
     *
     * Examples:
     *
     *      this.type = '.html';
     *      this.type = 'html';
     *      this.type = 'json';
     *      this.type = 'application/json';
     *      this.type = 'png';
     */
    set type( type: string ) {
        type = getType( type );
        if( type ) {
            this.set( 'Content-Type', type );
        } else {
            this.remove( 'Content-Type' );
        }
    },

    /**
     * Set the Last-Modified date using a string or a Date.
     *
     *      this.response.lastModified = new Date();
     *      this.response.lastModified = '2013-09-13';
     */
    set lastModified( val ) {
        if( !val ) return;
        if( 'string' === typeof val ) val = new Date( val );
        this.set( 'Last-Modified', val.toUTCString() );
    },

    /**
     * Get the Last-Modified date in Date form, if it exists.
     */
    get lastModified() {
        const date = this.get( 'last-modified' );
        if( date ) return new Date( date as string );
    },

    /**
     * Set the ETag of a response. This will normalize the quotes if necessary.
     *
     *      this.response.etag = 'md5hashsum';
     *      this.response.etag = '"md5hashsum"';
     *      this.response.etag = 'W//"123456789"';
     */
    set etag( val ) {
        if( !/^(W\/)?"/.test( val ) ) val = `"${val}"`;
        this.set( 'ETag', val );
    },

    /**
     * Get the ETag of a response.
     */
    get etag() {
        return this.get( 'ETag' ) as string;
    },

    /**
     * Return the response mime type void of parameters such as "charset".
     */
    get type() {
        return ( this.get( 'Content-Type' ) as string )?.split( ';', 1 )[ 0 ] || '';
    },

    /**
     * Check whether the response is one of the listed types.
     * Pretty much the same as `this.request.is()`.
     */
    is( ...types ) {
        return typeis( this.type, ...types );
    },

    /**
     * Return response header.
     *
     * Examples:
     *
     *      this.get( 'Content-Type' ); // => "text/plain"
     *      this.get( 'Content-Type' ); // => "text/plain"
     */
    get( field ) {
        return this.headers[ field.toLowerCase() ] || '';
    },

    /**
     * Returns true if the header identified by name is currently set in the outgoing headers.
     * The header name matching is case-insensitive.
     *
     * Examples:
     *
     *      this.has( 'Content-Type' ); // => true
     *      this.has( 'Content-Type' ); // => true
     */
    has( field ) {
        return this.res!.hasHeader( field );
    },

    /**
     * Set header `field` to `val` or pass an object of header fields
     *
     * Examples:
     *
     *      this.set( 'Foo', [ 'bar', 'baz' ] );
     *      this.set( 'Accept', 'application/json' );
     *      this.set( { Accept: 'text/plain', 'X-API-Key' : 'tobi' } );
     */
    set( field, val ) {
        if( this.headerSent ) return;

        if( typeof val === 'undefined' ) val = String( val );

        if( 2 === arguments.length ) {
            this.res!.setHeader( field as string, val as string | string[] );
        } else {
            for( const key in field as Record<string, string | string[]> ) {
                this.set( key, field[ key ] );
            }
        }
    },
    
    /**
     * Append additional header `field` with value `val`.
     *
     * Examples:
     *
     *      this.append( 'Link', [ '<http://localhost/>', '<http://localhost:3000/>' ] );
     *      this.append( 'Set-Cookie', 'foo=bar; Path=/; HttpOnly' );
     *      this.append( 'Warning', '199 Miscellaneous warning' );
     */
    append( field, val ) {
        const prev = this.get( field );
        if( prev ) {
            val = Array.isArray( prev ) ? prev.concat( val ) : [ prev as string ].concat( val );
        }
        this.set( field, val );
    },

    /**
     * Remove header `field`.
     */
    remove( field ) {
        if( this.headerSent ) return;
        this.res!.removeHeader( field );
    },

    /**
     * Checks if the request is writable.
     * Tests for the existence of the socket as node sometimes does not set it.
     */
    get writable() {
        // Can't write any more after response finished
        return ( this.res! as ServerResponse ).writableEnded ? false : ( this.res!.socket?.writable ?? true );
    },

    /**
     * Inspect implementation.
     */
    inspect() {
        if( !this.res ) return;
        return { ...this.toJSON(), body : this.body };
    },

    [ util.inspect.custom ]() {
        return this.inspect();
    },

    /**
     * Return JSON representation
     */
    toJSON() {
        return {
            status : this.status,
            message : this.message,
            headers : this.headers
        }
    },

    /**
     * Flush any set headers and begin the body
     */
    flushHeaders() {
        ( this.res! as ServerResponse ).flushHeaders();
    }
}

export default Response;
