/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorators/header.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/14/2021
 * Description:
 ******************************************************************/

import { IncomingHttpHeaders } from 'http';
import { Context } from '@ynn/common';
// import { createAppWithRequest } from '@ynn/testing';
import { Header } from '../src';

describe( '@Header()', () => {
    it( '', () => {

    } );
    // describe( 'Parameter Decorator', () => {
    //     it( '', async () => {

    //         const fn1 = jest.fn();
    //         const fn2 = jest.fn();
    //         const res = { status : 0, message : 'OK' };

    //         class IndexController {
    //             constructor( public ctx: Context ) {}

    //             @Action()
    //             index( @Header( 'X-Custom-Name' ) name: string, @Header() headers: IncomingHttpHeaders ) {
    //                 fn1( name );
    //                 fn2( headers );
    //                 return res;
    //             }
    //         }

    //         const ctx = await createAppWithRequest( {
    //             controllers : { index : IndexController }
    //         }, {
    //             request : {
    //                 method : 'GET',
    //                 url : '/',
    //                 headers : {
    //                     'X-Custom-Name' : 'Achilles'
    //                 },
    //                 body : { name : 'Achilles' }
    //             }
    //         } );

    //         expect( fn1 ).toHaveBeenCalled();
    //         expect( fn1 ).toHaveBeenCalledWith( 'Achilles' );
    //         expect( fn2 ).toHaveBeenCalled();
    //         expect( fn2 ).toHaveBeenCalledWith( { 'x-custom-name' : 'Achilles' } );
    //         expect( ctx.body ).toEqual( res );
    //         expect( ctx.response.headers ).toEqual( { 'content-type' : 'application/json; charset=utf-8' } );
    //         expect( ctx.response.status ).toEqual( 200 );
    //         expect( ctx.response.message ).toEqual( 'OK' );

    //     } );
    // } );

    // describe( 'Response Decorator', () => {
    //     it( '', async () => {
    //         const fn1 = jest.fn();
    //         const res = { status : 0, message : 'OK' };

    //         class IndexController {
    //             constructor( public ctx: Context ) {}

    //             @Action()
    //             @Header( 'X-Custom-Name', 'NewName' )
    //             @Header( {
    //                 'X-Response-Header' : 'X'
    //             } )
    //             index( @Header( 'X-Custom-Name' ) name: string ) {
    //                 fn1( name );
    //                 return res;
    //             }
    //         }

    //         const ctx = await createAppWithRequest( {
    //             controllers : { index : IndexController }
    //         }, {
    //             request : {
    //                 method : 'GET',
    //                 url : '/',
    //                 headers : {
    //                     'X-Custom-Name' : 'Achilles'
    //                 },
    //                 body : { name : 'Achilles' }
    //             }
    //         } );

    //         expect( fn1 ).toHaveBeenCalled();
    //         expect( fn1 ).toHaveBeenCalledWith( 'Achilles' );
    //         expect( ctx.body ).toEqual( res );
    //         expect( ctx.response.headers ).toEqual( {
    //             'content-type' : 'application/json; charset=utf-8',
    //             'x-custom-name' : 'NewName',
    //             'x-response-header' : 'X'
    //         } );
    //         expect( ctx.response.status ).toEqual( 200 );
    //         expect( ctx.response.message ).toEqual( 'OK' );

    //     } );
    // } );
} );

