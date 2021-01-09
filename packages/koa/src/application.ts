/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/application.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 09/29/2020
 * Description:
 ******************************************************************/

import http from 'http';
import util from 'util';
import { EventEmitter } from 'events';
import Stream from 'stream';
import Keygrip from 'keygrip';
import onFinished from 'on-finished';
import statuses from 'statuses';
import { HttpError } from 'http-errors';
import context, { KoaContext } from './context';
import request, { KoaRequest } from './request';
import response, { KoaResponse } from './response';
import compose from './middlewares/compose';

const debug = util.debuglog( 'ynn:koa:application' );
const RESPOND_EXPLICIT_NULL_BODY = Symbol.for( 'respond#explicit#null#body' );

export { compose };

export type Keys = Keygrip | string[];

export type KoaOptions = {
    keys?: Keys;
    env?: string;
    proxy?: boolean;
    maxIpsCount?: number;
    proxyIpHeader?: string;
    subdomainOffset?: number;
}

export { KoaContext, KoaRequest, KoaResponse };

export type KoaMiddleware = ( ...args: any[] ) => any;

export default class Koa extends EventEmitter {
    public silent = false;

    public proxy: boolean;

    public trustXRealIp = false;

    public proxyIpHeader: string;

    public context = Object.create( context );

    public request = Object.create( request );

    public response = Object.create( response );

    public middleware: KoaMiddleware[] = [];

    public subdomainOffset = 2;

    public maxIpsCount: number;

    public env = 'development';

    public keys: Keys;

    public static HttpError = HttpError;

    constructor( options: KoaOptions = {} ) {
        super();
        this.proxy = options.proxy || false;
        this.subdomainOffset = options.subdomainOffset || 2;
        this.proxyIpHeader = options.proxyIpHeader || 'X-Forwarded-For';
        this.maxIpsCount = options.maxIpsCount || 0;
        this.env = options.env || process.env.NODE_ENV || 'development';
        options.keys && ( this.keys = options.keys );

        /* istanbul ignore else */
        if( util.inspect.custom ) {
            this[ util.inspect.custom ] = this.inspect;
        }
    }

    /**
     * Shorthand for:
     *
     *      http.createServer( app.callback() ).listen( ... );
     *
     * @param {Mixed}
     * @return {Server}
     */
    listen( ...args ) {
        debug( 'listen' );
        const server = http.createServer( this.callback() );
        return server.listen( ...args );
    }

    /**
     * Return JSON representation.
     * We only bother showing settings.
     *
     * @return {Object}
     */
    toJSON(): Record<string, any> {
        return {
            subdomainOffset : this.subdomainOffset,
            proxy : this.proxy,
            env : this.env
        };
    }

    /**
     * Inspect implementation.
     *
     * @return {Object}
     */
    inspect(): Record<string, any> {
        return this.toJSON();
    }

    /**
     * Use the given middleware `fn`
     */
    use( fn: KoaMiddleware ): this {
        if( typeof fn !== 'function' ) throw new TypeError( 'middleware must be a function!' );
        debug( 'use %s', fn.name || '-' );
        this.middleware.push( fn );
        return this;
    }

    /**
     * Return a request handler callback
     * for node's native http server.
     *
     * @return {Function}
     */
    callback(): ( req, res )=> Promise<any> {
        if( !this.listenerCount( 'error' ) ) this.on( 'error', this.onerror );
        return ( req, res ) => this.handleRequest( this.createContext( req, res ), compose( this.middleware ) );
    }

    /**
     * handle request in callback
     */
    handleRequest( ctx, middleware: KoaMiddleware ): Promise<any> {
        ctx.app = this;
        const { res } = ctx;
        res.statusCode = 404;
        const onerror = e => ctx.onerror( e );
        onFinished( res, onerror );
        return middleware( ctx ).then( (): any => {
            if( ctx.respond === false ) return;
            if( !ctx.writable ) return;
            const { status } = ctx;
            let { body } = ctx;

            if( statuses.empty[ status ] ) {
                ctx.body = null;
                return res.end();
            }

            if( ctx.method === 'HEAD' ) {
                if( !res.headerSent && !ctx.response.has( 'Content-Length' ) ) {
                    const { length } = ctx.response;
                    Number.isInteger( length ) && ( ctx.length = length );
                }
                return res.end();
            }

            if( body === null ) {
                if( ctx.response[ RESPOND_EXPLICIT_NULL_BODY ] ) {
                    ctx.response.remove( 'Content-Type' );
                    ctx.response.remove( 'Transfer-Encoding' );
                    return res.end();
                }

                if( ctx.req.httpVersionMajor >= 2 ) {
                    body = String( status );
                } else {
                    body = ctx.message || String( status );
                }

                if( !res.headersSent ) {
                    ctx.type = 'text';
                    ctx.length = Buffer.byteLength( body );
                }
                return res.end( body );
            }

            if( Buffer.isBuffer( body ) ) return res.end( body );
            if( typeof body === 'string' ) return res.end( body );
            if( body instanceof Stream ) return body.pipe( res );

            body = JSON.stringify( body );
            if( !res.headersSent ) {
                ctx.length = Buffer.byteLength( body );
            }
            res.end( body );

        } ).catch( onerror );
    }

    /**
     * Initialize a new context
     */
    createContext( req, res ) {
        const context = Object.create( this.context );
        const request = context.request = Object.create( this.request );
        const response = context.response = Object.create( this.response );
        context.app = request.app = response.app = this;
        context.req = request.req = response.req = req;
        context.res = request.res = response.res = res;
        request.ctx = response.ctx = context;
        request.response = response;
        response.request = request;
        context.originalUrl = request.originalUrl = req.url;
        context.state = {};
        return context;
    }

    /**
     * Default error handler.
     */
    onerror( e: Error ): void {
        /* When dealing with cross-globals a normal `instanceof` check doesn't work properly
           See https://github.com/koajs/koa/issues/1466
           We can probably remove it onec jest fixes https://github.com/facekbook/jest/issues/2549. */
        if( ( {} ).toString.call( e ) !== '[object Error]' && !( e instanceof Error ) ) {
            throw new TypeError( util.format( 'non-error thrown: %j', e ) );
        }

        if( e.status === 404 || e.expose ) return;
        if( this.silent ) return;

        console.error( `\n${( e.stack || e.toString() ).replace( /^/gm, '  ' )}\n` );
    }
}
