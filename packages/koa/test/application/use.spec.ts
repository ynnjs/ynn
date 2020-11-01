/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 * 
 * File: application/use.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/06/2020
 * Description: 
 ******************************************************************/

import assert from 'assert';
import request from 'supertest';
import Koa from '../../src/application';

describe( 'app.use( fn )', () => {
    it( 'should compose middleware', async() => {
        const app = new Koa();
        const calls: any[] = [];

        app.use( ( ctx, next ) => {
            calls.push( 1 );
            return next().then(() => {
                calls.push( 6 );
            } );
        } );

        app.use( ( ctx, next ) => {
            calls.push( 2 );
            return next().then(() => {
                calls.push( 5 );
            } );
        } );

        app.use( ( ctx, next ) => {
            calls.push( 3 );
            return next().then(() => {
                calls.push( 4 );
            } );
        } );

        await request( app.callback() )
            .get( '/' )
            .expect( 404 );

        assert.deepEqual( calls, [ 1, 2, 3, 4, 5, 6 ] );
    } );

    xit( '[Deprecated generator] should compose mixed middleware', async() => {
        // process.once( 'deprecation', () => {} ); // silence deprecation message
        // const app = new Koa();
        // const calls: any[] = [];

        // app.use( ( ctx, next ) => {
        //     calls.push( 1 );
        //     return next().then(() => {
        //         calls.push( 6 );
        //     } );
        // } );

        // app.use( function * ( next ){
        //     calls.push( 2 );
        //     yield next;
        //     calls.push( 5 );
        // } );

        // app.use(( ctx, next ) => {
        //     calls.push( 3 );
        //     return next().then(() => {
        //         calls.push( 4 );
        //     } );
        // } );

        // await request( app.callback() )
        //     .get( '/' )
        //     .expect( 404 );

        // assert.deepEqual( calls, [ 1, 2, 3, 4, 5, 6 ] );
    } );

    // https://github.com/koajs/koa/pull/530#issuecomment-148138051
    it( 'should catch thrown errors in non-async functions', () => {
        const app = new Koa();

        app.use( ctx => ctx.throw( 'Not Found', 404 ) );

        return request( app.callback() )
            .get( '/' )
            .expect( 404 );
    } );

    xit( '[Deprecated generators] should accept both generator and function middleware', () => {
        // process.once( 'deprecation', () => {} ); // silence deprecation message
        // const app = new Koa();

        // app.use(( ctx, next ) => next() );
        // app.use( function * (){ this.body = 'generator'; } );

        // return request( app.callback() )
        //     .get( '/' )
        //     .expect( 200 )
        //     .expect( 'generator' );
    } );

    it( 'should throw error for non-function', () => {
        const app = new Koa();

        [ null, undefined, 0, false, 'not a function' ].forEach( v => {
            assert.throws( () => app.use( v as any ), /middleware must be a function!/ );
        } );
    } );

    xit( '[Deprecated generators] should output deprecation message for generator functions', () => {
        // process.once( 'deprecation', message => {
        //     assert(/Support for generators will be removed/.test( message ) );
        //     done();
        // } );

        // const app = new Koa();
        // app.use( function * (){} );
    } );
} );
