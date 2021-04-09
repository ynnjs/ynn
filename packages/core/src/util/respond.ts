/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/respond.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/16/2021
 * Description:
 ******************************************************************/

import Stream from 'stream';
import { IncomingMessage, ServerResponse, OutgoingHttpHeaders } from 'http';
import statuses from 'statuses';
import { Context } from '../context';

function setHeaders( headers: OutgoingHttpHeaders, res: ServerResponse ): void {
    Object.keys( headers ).forEach( ( field: string ) => {
        if( headers[ field ] !== undefined ) {
            res.setHeader( field, headers[ field ] as string );
        }
    } );
}

export function respond( ctx: Context, req: IncomingMessage, res: ServerResponse ): void {

    const { status, message, response } = ctx;
    res.statusCode = status;
    res.statusMessage = message;

    if( statuses.empty[ status ] ) {
        ctx.body = null;
        setHeaders( response.headers, res );
        res.end();
        return;
    }

    if( ctx.method === 'HEAD' ) {
        if( !res.headersSent && !ctx.response.has( 'Content-Length' ) ) {
            const { length } = ctx.response;
            if( Number.isInteger( length ) ) ctx.length = length;
        }
        setHeaders( response.headers, res );
        res.end();
        return;
    }

    let { body } = ctx;

    if( body === null ) {
        if( ctx.response.EXPLICIT_NULL_BODY ) {
            ctx.response.remove( 'Content-Type' );
            ctx.response.remove( 'Transfer-Encoding' );
            setHeaders( response.headers, res );
            res.end();
            return;
        }

        if( req.httpVersionMajor >= 2 ) {
            body = String( status );
        } else {
            body = message || String( status );
        }

        if( !res.headersSent ) {
            ctx.type = 'text';
            ctx.length = Buffer.byteLength( body as string );
        }
        setHeaders( response.headers, res );
        res.end( body );
        return;
    }

    if( Buffer.isBuffer( body ) || typeof body === 'string' ) {
        res.end( body );
        return;
    }

    if( body instanceof Stream ) {
        body.pipe( res );
        return;
    }

    body = JSON.stringify( body );
    if( !res.headersSent ) {
        ctx.length = Buffer.byteLength( body as string );
    }
    setHeaders( response.headers, res );
    res.end( body );
}
