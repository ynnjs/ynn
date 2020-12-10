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
    body?: BodyOptions;
    done?: ( ...args: any[] ) => any;
    request?: {
        send?: any[];
        set?: [string, string][];
        field?: [string, string][];
        attach?: [string, string][];
    }
}

function createApp( options: CreateAppOptions ) {
    const app = new Koa();

    app.use( async( ctx ) => {
        const parsed = await body( ctx, options?.body || {} );
        await options?.callback?.( parsed, ctx );
        options?.done?.();
    } );

    let send = request( app.callback() ).post( '/' );

    options?.request?.send?.forEach( ( x: any ) => {
        send = send.send( x );
    } )

    options.request?.set?.forEach( ( args: [string, string] ) => {
        send = send.set( ...args );
    } );

    options.request?.field?.forEach( ( args: [string, string] ) => {
        send = send.field( ...args );
    } );

    options.request?.attach?.forEach( ( args: [string, string] ) => {
        send = send.attach( ...args );
    } );

    send.end( () => {} );
}

describe( 'body', () => {
    describe( 'json', () => {
        it( 'application/json', done => {
            createApp( {
                done,
                request : {
                    send : [ { x : 1 } ]
                },
                callback( parsed ) {
                    expect( parsed ).toEqual( { x : 1 } );
                }
            } );
        } );
    } );
    
    describe( 'form', () => {
        it( 'application/x-www-form-urlencoded', done => {
            createApp( {
                done,
                request : {
                    send : [ 'x=1' ]
                },
                callback( parsed ) {
                    expect( parsed ).toEqual( { x : '1' } );
                }
            } );
        } );
    } );

    describe( 'text', () => {
        it( 'text/plain', done => {
            createApp( {
                done,
                request : {
                    send : [ 'x=1' ],
                    set : [ [ 'content-type', 'text/plain' ] ]
                },
                callback( parsed ) {
                    expect( parsed ).toEqual( 'x=1' );
                }
            } );
        } );
    } );

    describe( 'multipart', () => {
        it( 'multipart/*', done => {
            createApp( {
                done,
                request : {
                    field: [ [ 'name', 'x' ] ]
                },
                callback( parsed ) {
                    expect( parsed ).toEqual( {
                        fields : {
                            name : 'x'
                        },
                        files : {}
                    } );
                }
            } );
        } );
    } );
} );
