/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: helpers/koa.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/03/2020
 * Description: 
 ******************************************************************/

import net from 'net';
import { IncomingMessage, ServerResponse } from 'http';
import statuses from 'statuses';
import is from '@lvchengbin/is';
import Koa from '@ynn/koa';

export type ReqOptions = {
    headers?: Record<string, string>;
    method?: string;
    url?: string;
    httpVersion?: string;
    aborted?: boolean;
    socket?: any;
    complete?: boolean;
    statusCode?: number;
    statusMessage?: string;
    host?: string;
    remoteAddress?: string;
}

export class Req extends IncomingMessage {
    constructor( options: ReqOptions = {} ) {
        super();
        options.headers ?? ( this.headers = options.headers );
        this.method = options.method || 'GET';
        if( options.httpVersion ) {
            this.httpVersion = options.httpVersion;
            const [ httpVersionMajor, httpVersionMinor ] = this.httpVersion.split( '.' );
            Object.assign( this, { httpVersionMajor, httpVersionMinor } );
        }
        this.aborted = !!options.aborted;
        this.complete = is.boolean( options.complete ) ? options.complete : true;
        this.statusCode = options.statusCode || 200;
        if( options.statusMessage ) {
            this.statusMessage = options.statusMessage;
        } else {
            this.statusMessage = statuses.message[ this.statusCode ];
        }

        /**
         * if options.host is set, override the Host item in headers.
         */
        if( options.host ) {
            this.headers[ 'Host' ] = options.host;
        }

        this.socket = options.socket || new net.Socket();

        /**
         * set remoteAddress to 127.0.0.1
         */
        this.scoket.remoteAddress = options.remoteAddress || this.socket.remoteAddress || '127.0.0.1';
    }
}

export type ResOptions = {
    req?: IncomingMessage;
    socket?: any;
    headers?: Record<string, string>;
    statusCode?: number;
    statusMessage?: string;
}

export class Res extends ServerResponse {
    constructor( options: ResOptions = {} ) {
        super( options.req || new Req() );

        if( options.headers ) {
            for( const key of Object.keys( options.headers ) ) {
                this.setHeader( key, options.headers[ key ] );
            }
        }

        this.statusCode = options.statusCode || 200;

        if( options.statusMessage ) {
            this.statusMessage = options.statusMessage;
        } else {
            this.statusMessage = statuses.message[ this.statusCode ];
        }
    }
}

export type ContextOptions = {
    req?: IncomingMessage;
    res?: ServerResponse;
    app?: Koa;
};

export function createContext( options: ContextOptions = {} ) {
    const {
        app = new Koa(),
        req = new Req(),
        res = new Res()
    } = options;
    return app.createContext( req, res );
}

export function createRequest( reqOrOptions?: IncomingMessage | ReqOptions ) {
    const req = reqOrOptions instanceof IncomingMessage ? reqOrOptions : new Req( reqOrOptions );
    return createContext( { req } ).request;
}

export function createResponse( resOrOptions?: ServerResponse | ResOptions ) {
    const res = resOrOptions instanceof ServerResponse ? resOrOptions : new Res( resOrOptions );
    return createContext( { res } ).response;
}
