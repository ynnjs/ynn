/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: test/index.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/09/2020
 * Description:
 ******************************************************************/

import 'jest-extended';
import fs from 'fs';
import path from 'path';
import request from 'supertest';
import formidable from 'formidable';
import Koa from 'koa';
import { Context } from '@ynn/core';
import { VariadicFunction } from '@ynn/utility-types';
import body, { BodyOptions } from '../src';

interface CreateAppOptions {
    callback?: VariadicFunction;
    error?: VariadicFunction;
    body?: BodyOptions;
    beforeParsing?: ( ctx: Koa.Context ) => void;
    request?: {
        send?: ( Record<string, string | number> | string | undefined )[];
        set?: [string, string][];
        field?: [string, string][];
        attach?: [string, string][];
    };
}

function createApp( options: CreateAppOptions ) {
    const app = new Koa();

    app.use( async ( ctx ) => {
        options.beforeParsing?.( ctx );
        try {
            const parsed = await body( ctx as unknown as Context, options.body ?? {} );
            options.callback?.( parsed, ctx );
        } catch( e: unknown ) {
            if( !options.error ) {
                console.error( 'Uncaught Error: ', e ); // eslint-disable-line no-console
            }
            options.error?.( e );
        }
    } );

    let send = request( app.callback() ).post( '/' );

    options.request?.send?.forEach( x => {
        send = send.send( x );
    } );

    options.request?.set?.forEach( ( args: [string, string] ) => {
        send = send.set( ...args );
    } );

    options.request?.field?.forEach( ( args: [string, string] ) => {
        send = send.field( ...args );
    } );

    options.request?.attach?.forEach( ( args: [string, string] ) => {
        if( !fs.existsSync( args[ 1 ] ) ) {
            throw new TypeError( `${args[ 1 ]} not exists.` );
        }
        send = send.attach( ...args );
    } );

    send.end( () => {} );
}

describe( 'body', () => {
    describe( 'json', () => {
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

        it( 'options.jsonTypes', done => {
            const contentType = 'application/j-s-o-n';
            createApp( {
                body : {
                    jsonTypes : [ contentType ]
                },
                request : {
                    send : [ { x : 1 } ]
                    // set : [ [ 'content-type', 'application/j-s-o-n' ] ]
                },
                callback( parsed ) {
                    expect( parsed ).toEqual( { x : 1 } );
                    done();
                },
                beforeParsing( ctx ) {
                    ctx.headers[ 'content-type' ] = contentType;
                }
            } );
        } );

        it( 'should return with the raw body', done => {
            createApp( {
                request : {
                    send : [ { x : 1 } ]
                },
                callback( parsed ) {
                    expect( parsed ).toEqual( {
                        parsed : { x : 1 },
                        raw : JSON.stringify( { x : 1 } )
                    } );
                    done();
                },
                body : {
                    returnRawBody : true
                }
            } );
        } );
    } );

    describe( 'form', () => {
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

        it( 'options.formTypes', done => {
            const contentType = 'application/f-o-r-m';
            createApp( {
                body : {
                    formTypes : [ contentType ]
                },
                request : {
                    send : [ 'x=1' ]
                },
                callback( parsed ) {
                    expect( parsed ).toEqual( { x : '1' } );
                    done();
                },
                beforeParsing( ctx ) {
                    ctx.headers[ 'content-type' ] = contentType;
                }
            } );
        } );

        it( 'should return raw body', done => {
            createApp( {
                request : {
                    send : [ 'x=1' ]
                },
                callback( parsed ) {
                    expect( parsed ).toEqual( {
                        parsed : { x : '1' },
                        raw : 'x=1'
                    } );
                    done();
                },
                body : {
                    returnRawBody : true
                }
            } );
        } );
    } );

    describe( 'text', () => {
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

        it( 'options.textTypes', done => {
            const contentType = 'application/t-e-x-t';
            createApp( {
                body : {
                    textTypes : [ contentType ]
                },
                request : {
                    send : [ 'x=1' ]
                },
                callback( parsed ) {
                    expect( parsed ).toEqual( 'x=1' );
                    done();
                },
                beforeParsing( ctx ) {
                    ctx.headers[ 'content-type' ] = contentType;
                }
            } );
        } );

        it( 'text/plain', done => {
            createApp( {
                request : {
                    send : [ 'x=1' ],
                    set : [ [ 'content-type', 'text/plain' ] ]
                },
                callback( parsed ) {
                    expect( parsed ).toEqual( {
                        parsed : 'x=1',
                        raw : 'x=1'
                    } );
                    done();
                },
                body : {
                    returnRawBody : true
                }
            } );
        } );
    } );

    describe( 'multipart', () => {
        const file = path.resolve( __dirname, 'fixtures/upload.txt' );

        it( 'upload single file', done => {
            createApp( {
                request : {
                    field : [ [ 'name', 'x' ] ],
                    attach : [ [ 'file', file ] ]
                },
                callback( parsed ) {
                    expect( parsed ).toHaveProperty( 'fields', { name : 'x' } );
                    expect( parsed ).toHaveProperty( 'files' );
                    expect( parsed.files ).toHaveProperty( 'file' );
                    expect( parsed.files.file ).toBeInstanceOf( formidable.File );
                    expect( parsed.files.file ).toContainEntries( [
                        [ 'size', fs.statSync( file ).size ],
                        [ 'name', 'upload.txt' ],
                        [ 'type', 'text/plain' ]
                    ] );
                    expect( fs.readFileSync( parsed.files.file.path ) ).toEqual( fs.readFileSync( file ) );
                    done();
                }
            } );
        } );

        it( 'upload multiple files', done => {
            createApp( {
                request : {
                    field : [ [ 'name', 'x' ] ],
                    attach : [
                        [ 'file1', file ],
                        [ 'file2', file ]
                    ]
                },
                callback( parsed ) {
                    expect( parsed ).toHaveProperty( 'fields', { name : 'x' } );
                    expect( parsed ).toHaveProperty( 'files' );
                    expect( parsed.files ).toHaveProperty( 'file1' );
                    expect( parsed.files ).toHaveProperty( 'file2' );
                    expect( parsed.files.file1 ).toBeInstanceOf( formidable.File );
                    expect( parsed.files.file2 ).toBeInstanceOf( formidable.File );
                    expect( parsed.files.file1 ).toContainEntries( [
                        [ 'size', fs.statSync( file ).size ],
                        [ 'name', 'upload.txt' ],
                        [ 'type', 'text/plain' ]
                    ] );
                    expect( parsed.files.file2 ).toContainEntries( [
                        [ 'size', fs.statSync( file ).size ],
                        [ 'name', 'upload.txt' ],
                        [ 'type', 'text/plain' ]
                    ] );
                    expect( fs.readFileSync( parsed.files.file1.path ) ).toEqual( fs.readFileSync( file ) );
                    expect( fs.readFileSync( parsed.files.file2.path ) ).toEqual( fs.readFileSync( file ) );
                    done();
                }
            } );
        } );

        it( 'limit file size with options.multipartOptions.maxFileSize', done => {
            createApp( {
                body : {
                    limit : '1b',
                    multipartOptions : {
                        maxFileSize : '1b'
                    }
                },
                request : {
                    field : [ [ 'name', 'a-new-file.txt' ] ],
                    attach : [ [ 'file', file ] ]
                },
                error( e ) {
                    expect( e ).toBeInstanceOf( Error );
                    expect( e.message ).toMatch( /exceeded/ );
                    done();
                }
            } );
        } );

        it( 'limit fieldsSize with options.multipartOptions.maxFieldsSize', done => {
            createApp( {
                body : {
                    limit : '100MB',
                    multipartOptions : {
                        maxFieldsSize : '1b'
                    }
                },
                request : {
                    field : [ [ 'name', 'a-new-file.txt' ] ],
                    attach : [ [ 'file', file ] ]
                },
                error( e ) {
                    expect( e ).toBeInstanceOf( Error );
                    expect( e.message ).toMatch( /exceeded/ );
                    done();
                }
            } );
        } );
    } );
} );
