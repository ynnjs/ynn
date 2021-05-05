/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: test/controller.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 03/26/2021
 * Description:
 ******************************************************************/

import { createDecoratorAfter, createDecoratorBefore, createDecoratorException } from '@ynn/method-interceptor';
import { Context } from '@ynn/common';
import { Action } from '@ynn/decorators';
import { Ynn } from '../src';

describe( 'Controller', () => {

    it( 'should have called the request interceptor by adding method decorators', async () => {

        const fn = jest.fn().mockImplementation( ( metadata, context: Context ) => {
            context.response.status = 304;
        } );
        const Request = createDecoratorBefore( fn, {
            parameters : { name : 'ynn' }
        } );

        class IndexController {
            @Action()
            @Request
            index() {
                return { x : 1 };
            }
        }

        const app = new Ynn( {
            controllers : { index : IndexController }
        } );

        const context = await app.handle( {
            request : { method : 'GET', url : '/' }
        } );

        expect( fn ).toHaveBeenCalledTimes( 1 );
        const { response } = context;
        expect( response.body ).toEqual( { x : 1 } );
        expect( response.status ).toEqual( 304 );
    } );

    it( 'should have called the request interceptor by adding class decorators', async () => {

        const fn = jest.fn().mockImplementation( ( metadata, context: Context ) => {
            context.response.status = 304;
        } );
        const Request = createDecoratorBefore( fn, {
            parameters : { name : 'ynn' }
        } );

        @Request
        class IndexController {
            @Action()
            index() {
                return { x : 1 };
            }
        }

        const app = new Ynn( {
            controllers : { index : IndexController }
        } );

        const context = await app.handle( {
            request : { method : 'GET', url : '/' }
        } );

        expect( fn ).toHaveBeenCalledTimes( 1 );
        expect( context.response.body ).toEqual( { x : 1 } );
        expect( context.response.status ).toEqual( 304 );
    } );

    it( 'should have called the response interceptor by adding method decorators', async () => {

        const fn = jest.fn().mockImplementation( ( metadata, data ) => ( { status : 0, data } ) );
        const Response = createDecoratorAfter( fn, {
            parameters : { name : 'ynn' }
        } );

        class IndexController {
            @Action()
            @Response
            index() {
                return { x : 1 };
            }
        }

        const app = new Ynn( {
            controllers : { index : IndexController }
        } );

        const context = await app.handle( {
            request : { method : 'GET', url : '/' }
        } );

        expect( fn ).toHaveBeenCalledTimes( 1 );

        expect( context.response.body ).toEqual( {
            status : 0,
            data : { x : 1 }
        } );
    } );

    it( 'should have called the response interceptor by adding class decorators', async () => {
        const fn = jest.fn().mockImplementation( ( metadata, data ) => ( { status : 0, data } ) );
        const Response = createDecoratorAfter( fn, {
            parameters : { name : 'ynn' }
        } );

        @Response
        class IndexController {
            @Action()
            index() {
                return { x : 1 };
            }
        }

        const app = new Ynn( {
            controllers : { index : IndexController }
        } );

        const context = await app.handle( {
            request : { method : 'GET', url : '/' }
        } );

        expect( fn ).toHaveBeenCalledTimes( 1 );

        expect( context.response.body ).toEqual( {
            status : 0,
            data : { x : 1 }
        } );
    } );

    it( 'should have called the exception interceptor by adding method decorators', async () => {
        const fn = jest.fn().mockImplementation( () => ( { status : 1 } ) );
        const Exception = createDecoratorException( fn );

        class IndexController {
            @Action()
            @Exception
            index() {
                throw new Error( 'Something error' );
            }
        }

        const app = new Ynn( {
            controllers : { index : IndexController }
        } );

        const context = await app.handle( {
            request : { method : 'GET', url : '/' }
        } );

        expect( fn ).toHaveBeenCalledTimes( 1 );
        expect( context.response.body ).toEqual( { status : 1 } );
    } );

    it( 'should have called the exception interceptor by adding class decorators', async () => {
        const fn = jest.fn().mockImplementation( () => ( { status : 1 } ) );
        const Exception = createDecoratorException( fn );

        @Exception
        class IndexController {
            @Action()
            index() {
                throw new Error( 'Something error' );
            }
        }

        const app = new Ynn( {
            controllers : { index : IndexController }
        } );

        const context = await app.handle( {
            request : { method : 'GET', url : '/' }
        } );

        expect( fn ).toHaveBeenCalledTimes( 1 );
        expect( context.response.body ).toEqual( { status : 1 } );
    } );
} );
