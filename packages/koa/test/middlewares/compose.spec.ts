/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: middlewares/compose.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/02/2020
 * Description: 
 ******************************************************************/

import compose from '../../src/middlewares/compose';

const wait = ( ms = 1 ): Promise<any> => new Promise( r => setTimeout( r, ms ) );

describe( '@ynn/koa/compose', () => {
    it( 'should work', async () => {
        const arr: any[] = []; 
        const stack: any[] = [];

        stack.push( async ( ctx, next ) => {
            arr.push( 1 );
            await wait( 1 );
            await next();
            await wait( 1 );
            arr.push( 6 );
        } );

        stack.push( async ( ctx, next ) => {
            arr.push( 2 );
            await wait( 1 );
            await next();
            await wait( 1 );
            arr.push( 5 );
        } );

        stack.push( async ( ctx, next ) => {
            arr.push( 3 );
            await wait( 1 );
            await next();
            await wait( 1 );
            arr.push( 4 );
        } );

        await compose( stack )( {} );
        expect( arr ).toEqual( [ 1, 2, 3, 4, 5, 6 ] );
    } ); 

    it( 'should be able to be called twice', () => {
        const stack: any[] = [];

        stack.push( async( ctx, next ) => {
            ctx.arr.push( 1 );
            await wait( 1 );
            await next();
            await wait( 1 );
            ctx.arr.push( 6 );
        } );

        stack.push( async( ctx, next ) => {
            ctx.arr.push( 2 );
            await wait( 1 );
            await next();
            await wait( 1 );
            ctx.arr.push( 5 );
        } );

        stack.push( async( ctx, next ) => {
            ctx.arr.push( 3 );
            await wait( 1 );
            await next();
            await wait( 1 );
            ctx.arr.push( 4 );
        } );

        const fn = compose( stack );
        const ctx1 = { arr : [] };
        const ctx2 = { arr : [] };
        const out = [ 1, 2, 3, 4, 5, 6 ];

        return fn( ctx1 ).then( () => {
            expect( ctx1.arr ).toEqual( out );
            return fn( ctx2 );
        } ).then( () => {
            expect( ctx2.arr ).toEqual( out );
        } );
    } );

    it( 'should create next functions that return a Promise', () => {
        const stack: any[] = [];
        const arr: any[] = [];

        for( let i = 0; i < 5; i += 1 ) {
            stack.push( ( ctx, next ) => {
                arr.push( next() );
            } );
        }

        compose( stack )( {} );

        for( const next of arr ) {
            expect( next ).toHaveProperty( 'then' );
        }
    } );

    it( 'should work with 0 middleware', () => compose( [] )( {} ) );

    it( 'should work when yielding at the end of the stack', async () => {
        const stack: any[] = []; 
        let called = false;

        stack.push( async ( ctx, next ) => {
            await next();
            called = true;
        } );

        await compose( stack )( {} );
        expect( called ).toEqual( true );
    } );

    it( 'should reject on errors in middleware', () => {
        const stack: any[] = []; 
        stack.push( () => { throw new Error() } );
        return compose( stack )( {} ).catch( e => {
            expect( e ).toBeInstanceOf( Error );
        } );
    } );

    it( 'should work when yielding at the end of the stack with yield*', () => {
        const stack: any[] = [];
        stack.push( async( ctx, next ) => { await next } );
        return compose( stack )( {} ); 
    } );

    it( 'should keep the context', () => {
        const ctx: Record<string, any> = {}; 
        const stack: any[] = [];

        stack.push( async( ctx2, next ) => {
            await next();
            expect( ctx2 ).toEqual( ctx );
        } );

        stack.push( async( ctx2, next ) => {
            await next();
            expect( ctx2 ).toEqual( ctx );
        } );

        stack.push( async( ctx2, next ) => {
            await next();
            expect( ctx2 ).toEqual( ctx );
        } );

        return compose( stack )( ctx );
    } );

    it( 'should catch downstream errors', async () => {
        const arr: any[] = [];
        const stack: any[] = [];

        stack.push( async( ctx, next ) => {
            arr.push( 1 );
            try {
                arr.push( 6 );
                await next();
                arr.push( 7 );
            } catch( e ) {
                arr.push( 2 );
            }
            arr.push( 3 );
        } );

        stack.push( async () => {
            arr.push( 4 );
            throw new Error();
        } );

        await compose( stack )( {} );
        expect( arr ).toEqual( [ 1, 6, 4, 2, 3 ] );
    } );

    it( 'should compose w/ next', () => {
        let called = false; 
        return compose( [] )( {}, async () => { called = true } ).then( () => {
            expect( called ).toEqual( true );
        } );
    } );

    it( 'should handdle errors in wrapped non-async functions', () => {
        const stack: any[] = [];
        stack.push( () => { throw new Error() } );
        return compose( stack )( {} ).catch( e => { expect( e ).toBeInstanceOf( Error ) } );
    } );

    it( 'should compose w/ other compositions', () => {
        const called: any[] = [];        
        return compose( [
            compose( [
                ( ctx, next ) => ( called.push( 1 ), next() ),
                ( ctx, next ) => ( called.push( 2 ), next() )
            ] ),
            ( ctx, next ) => ( called.push( 3 ), next() )
        ] )( {} ).then( () => { expect( called ).toEqual( [ 1, 2, 3 ] ) } );
    } );

    it( 'should throw if next() is called multiple times', () => {
        return compose( [
            async ( ctx, next ) => {
                await next();
                await next();
            }
        ] )( {} ).catch( e => {
            expect( e ).toBeInstanceOf( Error );
            expect( e.message ).toMatch( /multiple times/ );
        } );
    } );

    it( 'should return a valid middleware', () => {
        let val = 0; 
        return compose( [
            compose( [
                ( ctx, next ) => ( val++, next() ),
                ( ctx, next ) => ( val++, next() ),
            ] ),
            ( ctx, next ) => ( val++, next() ),
        ] )( {} ).then( () => { expect( val ).toEqual( 3 ) } );
    } );

    it( 'should return last return value', () => {
        const stack: any[] = []; 

        stack.push( async ( ctx, next ) => {
            const val = await next();
            expect( val ).toEqual( 2 );
            return 1;
        } );

        stack.push( async ( ctx, next ) => {
            const val = await next();
            expect( val ).toEqual( 0 );
            return 2;
        } );

        return compose( stack )( {}, () => 0 ).then( val => {
            expect( val ).toEqual( 1 );
        } );
    } );

    it( 'should not affect the original middleware array', () => {
        const middleware: any[] = [];
        const fn1 = ( ctx, next ) => next();
        middleware.push( fn1 ); 
        compose( middleware );
        expect( middleware[ 0 ] ).toEqual( fn1 );
    } );

    it( 'should not get stuck on the passed in next', () => {
        const middleware = [ ( ctx, next ) => ( ctx.middleware++, next() ) ];
        const ctx = { middleware : 0, next : 0 };
        return compose( middleware )( ctx, ( ctx, next ) => ( ctx.next++, next() ) ).then( () => {
            expect( ctx ).toEqual( { middleware : 1, next : 1 } );
        } );
    } );
} );
