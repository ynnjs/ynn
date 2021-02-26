/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/response.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/09/2021
 * Description:
 ******************************************************************/

import util from 'util';
import assert from 'assert';
import Stream from 'stream';
import { Socket } from 'net';
import { extname } from 'path';
import { ServerResponse, OutgoingHttpHeaders } from 'http';
import { is } from 'type-is';
import statuses from 'statuses';
import encodeurl from 'encodeurl';
import escapehtml from 'escape-html';
import getType from 'cache-content-type';
import contentDisposition, { Options as ContentDispositionOptions } from 'content-disposition';
import { Valueof } from '@ynn/utility-types';
import Context from './context';

export interface ResponseOptions {
    ctx: Context;
    res?: ServerResponse;
    headers?: OutgoingHttpHeaders;
    statusCode?: number;
    statusMessage?: string;
}

export class Response {

    #headers: Map<string, Valueof<OutgoingHttpHeaders>>= new Map();
    #body: unknown = null;

    ctx: Context;
    statusCode = 200;
    statusMessage: string;

    res?: ServerResponse;

    EXPLICIT_STATUS = false;
    EXPLICIT_NULL_BODY = false;

    constructor( options: Readonly<ResponseOptions> ) {
        const { res } = options;
        this.ctx = options.ctx;
        options.statusCode && ( this.statusCode = options.statusCode );

        const { headers } = options;

        headers && Object.keys( headers ).forEach( ( name: string ) => {
            this.set( name, headers[ name ] );
        } );

        this.statusMessage = options.statusMessage === undefined ? ( statuses.message[ this.statusCode ] ?? '' ) : options.statusMessage;

        if( res ) {
            this.res = options.res;
            options.headers ?? ( this.headers = res.getHeaders() );
            options.statusCode ?? ( this.statusCode = res.statusCode );
            options.statusMessage ?? ( this.message = res.statusMessage );
        }

    }

    get socket(): Socket | null {
        return this.res?.socket ?? null;
    }

    /**
     * Get all set response headers
     */
    get headers(): OutgoingHttpHeaders {
        return Object.fromEntries( this.#headers );
    }

    /**
     * Set response headers
     */
    set headers( headers: OutgoingHttpHeaders ) {
        this.#headers.clear();
        Object.keys( headers ).forEach( ( name: string ) => {
            this.set( name, headers[ name ] );
        } );
    }

    /**
     * Get response status code
     */
    get status(): number {
        return this.statusCode;
    }

    /**
     * Set response status code
     */
    set status( code: number ) {
        if( this.headerSent ) return;
        assert( Number.isInteger( code ), 'status code must be an integer' );
        assert( code >= 100 && code < 999, `incalid status code: ${code}` );
        this.EXPLICIT_STATUS = true;
        this.statusCode = code;
        this.statusMessage = statuses.message[ code ] ?? '';
        if( this.body && statuses.empty[ code ] ) this.body = null;
    }

    /**
     * Get response status message
     */
    get message(): string {
        return this.statusMessage;
    }

    /**
     * Set response status message
     */
    set message( msg: string ) {
        this.statusMessage = msg;
    }

    /**
     * Get response body
     */
    get body(): unknown {
        return this.#body;
    }

    /**
     * Set response body
     */
    set body( val: unknown ) {
        const original = this.#body;
        this.#body = val;

        if( val === null ) {
            if( !statuses.empty[ this.status ] ) this.status = 204;
            this.EXPLICIT_NULL_BODY = true;
            this.remove( 'Content-Type' );
            this.remove( 'Content-Length' );
            this.remove( 'Transfer-Encoding' );
            return;
        }

        if( !this.EXPLICIT_STATUS ) this.status = 200;

        const setType = !this.has( 'Content-Type' );

        if( typeof val === 'string' ) {
            if( setType ) this.type = /^\s*</.test( val ) ? 'html' : 'text';
            this.length = Buffer.byteLength( val );
            return;
        }

        if( Buffer.isBuffer( val ) ) {
            if( setType ) this.type = 'bin';
            this.length = val.length;
            return;
        }

        if( val instanceof Stream ) {
            if( original !== null ) {
                this.remove( 'Content-Length' );
            }

            if( setType ) this.type = 'bin';
            return;
        }

        this.remove( 'Content-Length' );
        this.type = 'json';
    }

    /**
     * Set Content-Length field to n
     */
    set length( n: number | undefined ) {
        this.set( 'Content-Length', n );
    }

    /**
     * Return parsed response Content-Length when present.
     */
    get length(): number | undefined {
        if( this.has( 'Content-Length' ) ) {
            return parseInt( this.get( 'Content-Length' ) as string, 10 ) || 0;
        }
        const { body } = this;
        if( !body || body instanceof Stream ) return undefined;
        if( typeof body === 'string' ) return Buffer.byteLength( body );
        if( Buffer.isBuffer( body ) ) return body.length;
        return Buffer.byteLength( JSON.stringify( body ) );
    }

    /**
     * Check if a header has been written to the socket.
     */
    get headerSent(): boolean {
        return this.res?.headersSent ?? false;
    }

    /**
     * Vary on `field`
     */
    vary(): void {
        if( this.headerSent ) return;
    }

    /**
     * Perform a 302 redirect to `url`.
     */
    redirect( url: string, alt?: string ): void {
        if( url === 'back' ) url = this.ctx.get( 'Referrer' ) || ( alt ?? '/' );
        this.set( 'Location', encodeurl( url ) );

        if( !statuses.redirect[ this.status ] ) this.status = 302;

        if( this.ctx.accepts( 'html' ) ) {
            url = escapehtml( url );
            this.type = 'text/html; charset=utf-8';
            this.body = `Redirecting to <a href="${url}">${url}</a>`;
            return;
        }

        this.type = 'text/plain; charset=utf-8';
        this.body = `Redirecting to ${url}.`;
    }

    /**
     * Set Content-Disposition header to "attachment" with optional `filename`( ...args );
     */
    attachment( filename?: string, options?: ContentDispositionOptions ): void {
        if( filename ) this.type = extname( filename );
        this.set( 'Content-Disposition', contentDisposition( filename, options ) );
    }

    /**
     * Set Content-Type response header with `type` through `mime.lookup()`
     */
    set type( type: string ) {
        type = getType( type );
        if( type ) {
            this.set( 'Content-Type', type );
        } else {
            this.remove( 'Content-Type' );
        }
    }

    /**
     * Return the response mime type void of parameters such as "charset".
     */
    get type(): string {
        return ( this.get( 'Content-Type' ) as string ).split( ';', 1 )[ 0 ] || '';
    }

    /**
     * Set the Last-Modified date using a string or a Date.
     */
    set lastModified( val: Date | undefined ) {
        if( typeof val === 'string' ) val = new Date( val );
        this.set( 'Last-Modified', ( val as Date ).toUTCString() );
    }

    /**
     * Get the Last-Modified date in Date form, if it exists
     */
    get lastModified(): Date | undefined {
        const date = this.get( 'Last-Modified' );
        if( date ) return new Date( date as string );
        return undefined;
    }

    /**
     * Set the ETag of a response
     */
    set etag( val: string ) {
        if( !/^(W\/)?"/.test( val ) ) val = `"${val}"`;
        this.set( 'ETag', val );
    }

    /**
     * Get the ETag of a response
     */
    get etag(): string {
        return this.get( 'ETag' ) as string || '';
    }

    /**
     * Check whether the response is one of the listed types.
     * Pretty much the same as `this.request.is()`.
     */
    is( ...args: [ ...string[] ] | string[] ): string | false | null {
        return is( this.type, ...args );
    }

    /**
     * Return response header.
     */
    get( field: string ): Valueof<OutgoingHttpHeaders> {
        return this.#headers.get( field.toLowerCase() );
    }

    /**
     * Returns true if the header identified by name is currently set in the outgoing headers.
     * The header name matching is case-insensitive.
     */
    has( field: string ): boolean {
        return this.#headers.has( field );
    }

    /**
     * Set header `field` to `val` or pass an object of header fields
     */
    set( field: string | OutgoingHttpHeaders, val?: Valueof<OutgoingHttpHeaders> ): void {
        if( this.headerSent ) return;

        if( arguments.length === 2 ) {
            this.#headers.set( ( field as string ).toLowerCase(), val );
        } else {
            for( const key in field as OutgoingHttpHeaders ) this.set( key, field[ key ] );
        }
    }

    /**
     * Append additional header `field` with value `val`.
     */
    append( field: string, val: NonNullable<Valueof<OutgoingHttpHeaders>> ): void {
        const prev = this.get( field );
        if( prev !== undefined ) {
            if( Array.isArray( prev ) ) {
                val = prev.concat( String( val ) );
            } else if( typeof prev === 'number' ) {
                val = [ String( prev ) ].concat( String( val ) );
            } else {
                val = [ prev ].concat( String( val ) );
            }
        }
        this.set( field, val );
    }

    /**
     * Remove header `field`
     */
    remove( field: string ): void {
        if( this.headerSent ) return;
        this.#headers.delete( field.toLowerCase() );
    }

    getHeaderNames(): string[] {
        return Array.from( this.#headers.keys() );
    }

    /**
     * Checks if the request if writable.
     * Tests for the existence of the socket
     * as node sometimes does not set it.
     */
    get writable(): boolean {
        /**
         * if the native res object is not set, return true directly
         */
        if( !this.res ) return true;

        /**
         * can't write any more after response finished
         */
        if( this.res.writableEnded || this.res.finished ) return false;

        const socket = this.res.socket;
        if( !socket ) return true;
        return socket.writable;
    }

    /**
     * Inspect implementation
     */
    inspect(): Record<string, unknown> {
        return { ...this.toJSON(), body : this.body };
    }

    /**
     * Return JSON representation
     */
    toJSON(): Record<string, unknown> {
        return {
            status : this.status,
            message : this.message,
            headers : this.headers
        };
    }

    /**
     * Flush any set headers and begin the body
     */
    flushHeaders(): void {
        this.res?.flushHeaders();
    }

    [ util.inspect.custom ](): Record<string, unknown> {
        return this.inspect();
    }
}
