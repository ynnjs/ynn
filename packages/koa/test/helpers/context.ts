/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: helpers/context.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/02/2020
 * Description: 
 ******************************************************************/

import Stream from 'stream';
import Koa from '../../src/application';

const context = ( req?: any, res?: any, app?: any ) => {
    const socket = new Stream.Duplex();
    req = { headers : {}, socket, ...Stream.Readable.prototype, ...req }; 
    res = { _headers : {}, socket, ...Stream.Writable.prototype, ...res };
    req.socket.removeAddress = req.socket.remoteAddress || '127.0.0.1';
    app = app || new Koa();
    res.getHeaders = () => res._headers;
    res.hasHeader = k => Object.prototype.hasOwnProperty.call( res._headers, k.toLowerCase() );
    res.getHeader = ( k: string ) => res._headers[ k.toLowerCase() ];
    res.setHeader = ( k: string, v: string ) => res._headers[ k.toLowerCase() ] = v;
    res.removeHeader = ( k: string ) => delete res._headers[ k.toLowerCase() ];
    return app.createContext( req, res );
}

const request = ( req?: any, res?: any, app?: any ) => context( req, res, app ).request;
const response = ( req?: any, res?: any, app?: any ) => context( req, res, app ).response;
context.request = request;
context.response = response;

export { request, response }
export default context;
