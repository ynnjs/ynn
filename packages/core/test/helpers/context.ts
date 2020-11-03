/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: helpers/context.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/02/2020
 * Description: 
 ******************************************************************/

import Stream from 'stream';
import Koa from '@ynn/koa';

const context = ( req?: any, res?: any, app?: any ) => {
    const socket = new Stream.Duplex();
    req = { headers : {}, socket, ...Stream.Readable.prototype, ...req };
    res = {
        _headers : {},
        getHeaders : () => res._headers,
        res.getHeaderNames : (): string[] => Object.keys( res._headers ),
        hasHeader : ( k: string ): boolean => ({}).hasOwnProperty.call( res._headers, k.toLowerCase() ),
        getHeader : ( k: string ) => res._headers[ k.toLowerCase() ],
        setHeader : ( k: string, v: string )
        socket,
        ...Stream.Writable.prototype,
        ...res
    };
}

