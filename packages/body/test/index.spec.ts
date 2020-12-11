/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: test/index.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/09/2020
 * Description: 
 ******************************************************************/

import path from 'path';
import request from 'supertest';
import Koa from '@ynn/koa';
import body, { BodyOptions } from '../src';

interface CreateAppOptions {
    callback?: ( ...args: any[] ) => any;
    error?: ( ...args: any[] ) => any;
    body?: BodyOptions;
    request?: {
        send?: any[];
        set?: [string, string][];
        field?: [string, string][];
        attach?: [string, string][];
    }
}

function createApp( options: CreateAppOptions ) {
    const app = new Koa();

    app.use( async ( ctx ) => {
        try {
            const parsed = await body( ctx, options?.body || {} );
            options?.callback?.( parsed, ctx );
        } catch( e ) {
            if( !options?.error ) console.log( e );
            options?.error?.( e );
        }
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
    xdescribe( 'json', () => {
        it( 'application/json', done => {
            createApp( {
                request : {
                    send : [ { x : 1 } ]
                },
                callback( parsed ) {
                    expect( parsed ).toEqual( { x : 1 } );
                    done();
                }
            } );
        } );

        it( 'limit', done => {
            createApp( {
                body : { limit : '1b' },
                request : {
                    send : [ { x : 1 } ]
                },
                error( e ) {
                    expect( e ).toBeInstanceOf( Error );
                    expect( e.message ).toMatch( /request entity too large/ );
                    done();
                }
            } );
        } );
    } );
    
    xdescribe( 'form', () => {
        it( 'application/x-www-form-urlencoded', done => {
            createApp( {
                request : {
                    send : [ 'x=1' ]
                },
                callback( parsed ) {
                    expect( parsed ).toEqual( { x : '1' } );
                    done();
                }
            } );
        } );

        it( 'limit', done => {
            createApp( {
                body : { limit : '1b' },
                request : {
                    send : [ 'x=1' ]
                },
                error( e ) {
                    expect( e ).toBeInstanceOf( Error );
                    expect( e.message ).toMatch( /request entity too large/ );
                    done();
                }
            } );
        } );
    } );

    xdescribe( 'text', () => {
        it( 'text/plain', done => {
            createApp( {
                request : {
                    send : [ 'x=1' ],
                    set : [ [ 'content-type', 'text/plain' ] ]
                },
                callback( parsed ) {
                    expect( parsed ).toEqual( 'x=1' );
                    done();
                }
            } );
        } );

        it( 'limit', done => {
            createApp( {
                body : { limit : '1b' },
                request : {
                    send : [ 'x=1' ],
                    set : [ [ 'content-type', 'text/plain' ] ]
                },
                error( e ) {
                    expect( e ).toBeInstanceOf( Error );
                    expect( e.message ).toMatch( /request entity too large/ );
                    done();
                }
            } );
        } );
    } );

    describe( 'multipart', () => {
        it( 'multipart/*', done => {
            createApp( {
                request : {
                    field : [ [ 'name', 'a-new-file.txt' ] ],
                    attach: [ [ 'file', path.resolve( __dirname, '../fixtures/upload.txt' ) ] ]
                },
                callback( parsed ) {
                    expect( parsed ).toEqual( {
                        fields : { name : 'x' },
                        files : {}
                    } );
                    done();
                },
                error( e ) {
                    console.error( e );
                    done();
                }
            } );
        } );

        xit( 'limit fieldsSize with options.limit', done => {
            createApp( {
                body : { limit : '1b' },
                request : {
                    field : [ [ 'name', 'a-new-file.txt' ] ],
                    attach: [ [ 'file', path.resolve( __dirname, '../fixtures/upload.txt' ) ] ]
                },
                error( e ) {
                    expect( e ).toBeInstanceOf( Error );
                    expect( e.message ).toMatch( /maxFieldsSize exceeded/ );
                    done();
                }
            } );
        } );

        xit( 'limit fieldsSize with options.limit', done => {
            createApp( {
                body : { limit : '1b' },
                request : {
                    field : [ [ 'name', 'a-new-file.txt' ] ],
                    attach: [ [ 'file', path.resolve( __dirname, '../fixtures/upload.txt' ) ] ]
                },
                error( e ) {
                    expect( e ).toBeInstanceOf( Error );
                    expect( e.message ).toMatch( /maxFieldsSize exceeded/ );
                    done();
                }
            } );
        } );
    } );
} );
