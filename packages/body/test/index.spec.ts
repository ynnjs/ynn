/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: test/index.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/09/2020
 * Description: 
 ******************************************************************/

import request from 'supertest';
import Koa from '@ynn/koa';
import body, { BodyOptions } from '../src';

interface CreateAppOptions {
    callback: ( ...args: any[] ) => any;
    bodyOptions?: BodyOptions;
    done?: ( ...args: any[] ) => any;
    requestOptions?: {
        send?: any;
        set?: [string, string][];
        field?: [string, string][];
        attach?: [string, string][];
    }
}

function createApp( options: CreateAppOptions ) {
    const app = new Koa();

    app.use( async( ctx ) => {
        const parsed = await body( ctx, options.bodyOptions || {} );
        options.callback();
    } );

    const send = request( app.callback() ).post( '/' );
        
}

describe( 'body', () => {
    
    it( '', done => {
        const app = new Koa();
        app.use( async ( ctx ) => {
            ctx.body = {};
            const parsed = await body( ctx );
            console.log( parsed );
            done();
        } );
        request( app.callback() )
            .post( '/' )
            .send( { name : 'lx' } )
            .expect( 200 )
            .end( () => {} );
    } );
} );
