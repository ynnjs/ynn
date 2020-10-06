/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/context.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/02/2020
 * Description: 
 ******************************************************************/

import util from 'util';
import Cookies from 'cookies';
import statuses from 'statuses';
import httpErrors, { HttpError } from 'http-errors';
import httpAssert from 'http-assert';
import Delegates from './delegates';
import { KoaRequest } from './request';
import { KoaResponse } from './response';

const COOKIES = Symbol( 'cookies' );

export interface KoaContext {
    request?: KoaRequest;
    response?: KoaResponse;
    [ COOKIES ]?: Cookies;
    [ key: string ]: any;
}

const context: KoaContext = {

    /**
     * util.inspect() implementation which just returns the JSON output.
     */
    inspect(): any {
        if( this === context ) return this;
        return this.toJSON();
    },

    [ util.inspect.custom ](): any {
        return this.inspect();
    },

    /**
     * Return JSON representation.
     *
     * Here we explicitly invoke .toJSON() on each object,
     * as iteration will otherwise fail due to the getters and cause utilities such clone() to fail.
     */
    toJSON(): Record<string, any> {
        return {
            request : this.request!.toJSON(),
            response : this.response!.toJSON(),
            app : this.app.toJSON(),
            originalUrl : this.originalUrl,
            req : '<original node req>',
            res : '<original node res>',
            socket : '<original node socket>'
        }
    },

    /**
     * Similar to .throw(), adds assertion.
     *
     *      this.assert( this.user, 401, 'Please login!' );
     *
     * See: https://github.com/jshttp/http-assert
     */
    assert: httpAssert,

    /**
     * Throw an error with `status` (default 500) and `msg`.
     * Note that these are user-level errors,
     * and the message may be exposed to the client.
     *
     *      this.throw( 403 );
     *      this.throw( 400, 'name required' );
     *      this.throw( 'something exploded' );
     *      this.throw( new Error( 'invalid' ) );
     *      this.throw( 400, new Error( 'invalid' ) );
     *
     * See: https://github.com/jshttp/http-errors
     *
     * Note: `status` should only be passed as the first parameter.
     */
    throw( ...args ): void {
        throw httpErrors( ...args );
    },

    /**
     * Default error handling.
     */
    onerror( e: Error ): void {
        // don't do anything if there is no error.
        // this allows you to pass `this.onerror` to node-style callbacks.
        if( null === e ) return;

        // When dealing with cross-globals a normal `instanceof` check doesn't work properly
        // See https://github.com/koajs/koa/issues/1466
        // We can probably remove it onec jest fixes https://github.com/facekbook/jest/issues/2549.
        if( ({}).toString.call( e ) !== '[object Error]' && !( e instanceof Error ) ) {
            e = new Error( util.format( 'non-error thrown: %j', e ) );
        }

        let headerSent = false;
        if( this.headerSent || !this.writable ) {
            headerSent = ( e as HttpError ).headerSent = true;
        }

        // delegate
        this.app.emit( 'error', e, this );

        // nothing we can do here other than delegate to the app-level handler and log
        if( headerSent ) return;

        const { res } = this;

        // first unset all headers
        res.getHeaderNames().forEach( name => res.removeHeader( name ) );

        // then set those specified
        this.set( ( e as HttpError ).headers );

        // force text/plain
        this.type = 'text';

        let statusCode = ( e as HttpError ).status || ( e as HttpError ).statusCode;

        // ENOENT support
        if( 'ENOENT' === ( e as HttpError ).code ) statusCode = 404;

        // default to 500
        if( 'number' !== typeof statusCode || !statuses.message[ statusCode ] ) statusCode = 500;

        // respond
        const code = statuses.message[ statusCode ];
        const msg = ( e as HttpError ).expose ? e.message : code;
        this.status = ( e as any ).status = statusCode;
        this.length = Buffer.byteLength( msg as string );
        res.end( msg );
    },

    get cookies(): Cookies {
        return this[ COOKIES ] ||= new Cookies( this.req, this.res, {
            keys : this.app.keys,
            secure : this.request!.secure
        } );
    },

    set cookies( cookies: Cookies ) {
        this[ COOKIES ] = cookies;
    }
}

/**
 * Response delegation.
 */
new Delegates( context, 'response' )
    .methods( 'attachment', 'redirect', 'remove', 'vary', 'has', 'set', 'append', 'flushHeaders' )
    .accesses( 'status', 'message', 'body', 'length', 'type', 'lastModified', 'etag' )
    .getters( 'headerSent', 'writable' );

/**
 * Request delegation.
 */
new Delegates( context, 'request' )
    .methods( 'acceptsLanguages', 'acceptsEncodings', 'acceptsCharsets', 'accepts', 'get', 'is' )
    .accesses( 'querystring', 'idempotent', 'socket', 'search', 'method', 'query', 'path', 'url', 'accept' )
    .getters( 'origin', 'href', 'subdomains', 'protocol', 'host', 'hostname', 'URL', 'header', 'headers', 'secure', 'stale', 'fresh', 'ips', 'ip' );

export default context;
