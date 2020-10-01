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
import Stream from 'stream';
import assert from 'assert';
import vary from 'vary';
import statuses from 'statuses';
import encodeurl from 'encodeurl';
import typeis from 'type-is';
import onFinished from 'on-finished';
import getType from 'cache-content-type';
import contentDisposition from 'content-disposition';


export type ResponseBody = string | null | Buffer | Stream | Record<any, any>;

export default {
    /**
     * Return the request socket
     */
    get socket(): Socket {
        return this.req.socket;
    },

    /**
     * Return response header.
     */
    get header(): Record<string, string> {
        return this.res.getHeaders();
    },

    /**
     * Return response header, alias as response.header
     */
    get headers(): Record<string, string> {
        return this.header;
    },
    
    /**
     * Get response status code
     */
    get status(): number {
        this.res.statusCode;
    },

    /**
     * Set response status code
     */
    set status( code: number ): void {
        if( this.headerSent ) return;
        assert( code >= 100 && code <= 999, `invalid status code: ${code}` );
        this._explicitStatus = true;
        this.res.statusCode = code;
        if( this.req.httpVersionMajor < 2 ) this.res.statusMessage = statuses[ code ];
    },

    /**
     * Get response status message
     */
    get message(): string {
        return this.res.statusMessage || statuses[ this.status ];
    },

    /**
     * Set response status message
     */
    set message( msg: string ): void {
        this.res.statusMessage = msg;
    },

    /**
     * Get response body.
     */
    get body(): ResponseBody {
        return this._body;
    },

    /**
     * Set response body
     */
    set body( val: ResponseBody ): void {
        const original = this._body;
        this._body = val;

        // no content
        if( null == val ) {
            if( !statuses.empty[ this.status ] ) this.status = 204;
            if( val === null ) this._explicitNullBody = true;
            this.remove( 'Content-Type' );
            this.remove( 'Content-Length' );
            this.remove( 'Transfer-Encoding' );
            return;
        }

        // set the status
        if( !this._explicitStatus ) this.status = 200;

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
            onFinished( this.res, () => val.destroy() );
            if( original != val ) {
                val.once( 'error', e => this.ctx.onerror( e ) );
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
    set length( n: number ): void {
        this.et( 'Content-Length', n );
    },

    /**
     * Return parsed response Content-Length when present
     */
    get length(): number | undefined {
        if( this.has( 'Content-Length' ) ) {
            return parseInt( this.get( 'Content-Length' ), 10 ) || 0;
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
    get headerSent(): boolean {
        return this.res.headerSent;
    },

    /**
     * Vary on `field`.
     */
    vary( field ): void {
        if( this.headerSent ) return;
        vary( this.res, field );
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
    redirect( url, alt ): void {
        // location
        if( 'back' === url ) url = this.ctx.get( 'Referrer' ) || alt || '/';
        this.set( 'Location', encodeurl( url ) );

        // status
        if( !statuses.redirect[ this.status ] ) this.status = 302;

        // html
        if( this.ctx.accepts( 'html' ) ) {
            url = escape( url );
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
    attachment( filename: string, options ) {
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
    set type( type: string ): void {
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
    set lastModified( val: string | Date ): void {
        if( 'string' === typeof val ) val = new Date( val );
        this.set( 'Last-Modified', val.toUTCString() );
    },

    /**
     * Get the Last-Modified date in Date form, if it exists.
     */
    get lastModified(): Date {
        const date = this.get( 'last-modified' );
        if( date ) return new Date( date );
    },

    /**
     * Set the ETag of a response. This will normalize the quotes if necessary.
     *
     *      this.response.etag = 'md5hashsum';
     *      this.response.etag = '"md5hashsum"';
     *      this.response.etag = 'W//"123456789"';
     */
    set etag( val: string ): void {
        if( !/^(W\/)?"/.test( val ) ) val = `"${val}"`;
        this.set( 'ETag', val );
    },

    /**
     * Get the ETag of a response.
     */
    get etag(): string {
        return this.get( 'ETag' );
    },

    /**
     * Return the response mime type void of parameters such as "charset".
     */
    get type(): string {
        return this.get( 'Content-Type' )?.split( ';', 1 )[ 0 ] || '';
    },

    /**
     * Check whether the response is one of the listed types.
     * Pretty much the same as `this.request.is()`.
     */
    is( type: string | string[], ...types: Array<string | string[]> ): string | boolean {
        return typeis( this.type, type, ...types );
    },

    /**
     * Return response header.
     *
     * Examples:
     *
     *      this.get( 'Content-Type' ); // => "text/plain"
     *      this.get( 'Content-Type' ); // => "text/plain"
     */
    get( field: string ): string {
        return this.header[ field.toLowerCase() ] || '';
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
    has( field: string ): boolean {
        return this.res.hasHeader( field );
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
    set( field: string | Record<string, string | string[]>, val?: string | string[] ): void {
        if( this.headerSent ) return;

        if( 2 === arguments.length ) {
            this.res.setHeader( field as string, val as string | string[] );
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
    append( field: string, val: string | string[] ): void {
        const prev = this.get( field );
        if( prev ) {
            val = Array.isArray( prev ) ? prev.concat( val ) : [ prev ].concat( val );
        }
        return this.set( field, val );
    },

    /**
     * Remove header `field`.
     */
    remove( field: string ): void {
        if( this.headerSent ) return;
        this.res.removeHeader( field );
    },

    /**
     * Checks if the request is writable.
     * Tests for the existence of the socket as node sometimes does not set it.
     */
    get writable(): boolean {
        // Can't write any more after response finished
        return this.res.writableEnded ? false : ( this.res.socket?.writable ?? true );
    },

    /**
     * Inspect implementation.
     */
    inspect(): Record<string, any> | void {
        if( !this.res ) return;
        return { ...this.toJSON, body : this.body };
    },

    [ util.inspect.custom ](): Record<string, any> | void {
        return this.inspect();
    },

    /**
     * Return JSON representation
     */
    toJSON(): Record<string, any> {
        return {
            status : this.status,
            message : this.message,
            header : this.header
        }
    },

    /**
     * Flush any set headers and begin the body
     */
    flushHeaders() {
        this.res.flushHeaders();
    }
}
