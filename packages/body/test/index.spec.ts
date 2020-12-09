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

function createApp( options: BodyOptions = {} ) {
    const app = new Koa();

    app.use( async( ctx ) => {
        const parsed = await body( ctx );

    } );

    request( app.callback() )
        .post( '/' );
}

describe( 'body', () => {
    
    it( '', done => {
        const app = new Koa();
        app.use( async ( ctx ) => {
            console.log( 'xxxxxxxxxxxxxxxxx' );
            const body = await parser( ctx );
            done();
        } );
        request( app.callback() )
            .post( '/' )
            .then( () => {} );
    } );
} );
