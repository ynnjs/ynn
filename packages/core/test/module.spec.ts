/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: test/module.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/02/2021
 * Description:
 ******************************************************************/

import { createDecoratorAfter, createDecoratorBefore, createDecoratorException } from '@ynn/method-interceptor';
import { Action, Module } from '@ynn/decorators';
import { Ynn, Options, Context } from '../src';

describe( 'Module', () => {

    const responseData = { x : 1 };

    const Req = createDecoratorBefore( ( metadata, context: Context ) => {
        context.__package = 'ynn';
    } );

    @Req
    class HomeController {
        @Action()
        index() {
            return responseData;
        }
    }

    const Err = createDecoratorException( ( metadata, e: unknown ) => {
        if( e instanceof Error && e.message === 'something wrong' ) {
            throw new Error( 'another error' );
        }
        throw e;
    } );

    @Err
    class ErrorController {
        @Action()
        suppress() {
            throw new Error( 'something wrong' );
        }

        @Action()
        bang() {
            throw new Error( 'bang' );
        }
    }

    @Module( {
        controllers : {
            home : HomeController
        }
    } )
    class HomeModule {}

    @Module( {
        modules : {
            home : HomeModule
        }
    } )
    class UserModule {}

    const Request = createDecoratorBefore( ( metadata, context: Context ) => {
        context.__name = 'test';
    } );
    const Response = createDecoratorAfter( ( metadata, data ) => ( { status : 0, data } ) );

    @Request
    @Response
    @Module( {
        controllers : {
            home : HomeController
        }
    } )
    class InfoModule {}

    const Exception = createDecoratorException( ( metadata, e: unknown ) => {
        if( e instanceof Error && e.message === 'another error' ) {
            return { error : 0 };
        }
        throw e;
    } );

    @Exception
    @Module( {
        controllers : {
            error : ErrorController
        }
    } )
    class ErrorModule {}

    const options: Options = {
        controllers : {
            home : HomeController
        },
        modules : {
            user : UserModule,
            home : HomeModule,
            info : InfoModule,
            error : ErrorModule
        },
        logging : false
    };

    const app1 = new Ynn( options );

    // @Module( options )
    // class IndexModule {}

    // const app2 = Ynn.create( IndexModule );

    it( 'should have loaded modules', () => {
        expect( app1.modules ).toHaveProperty( 'home' );
        expect( app1.modules ).toHaveProperty( 'user' );
    } );

    it( 'should have loaded controllers in modules', () => {
        expect( app1.modules.home.controllers ).toHaveProperty( 'home' );
    } );

    it( 'should have loaded modules in modules', () => {
        expect( app1.modules.user.modules ).toHaveProperty( 'home' );
    } );

    it( 'should give the main Ynn instance an empty array as mountingPath', () => {
        expect( app1.mountingPath ).toEqual( [ app1 ] );
    } );

    it( 'should give modules correct mountingPath', () => {
        const { modules } = app1;
        expect( modules.user.mountingPath ).toEqual( [ app1, modules.user ] );
        expect( modules.home.mountingPath ).toEqual( [ app1, modules.home ] );
        expect( modules.user.modules.home.mountingPath ).toEqual( [ app1, modules.user, modules.user.modules.home ] );
    } );

    it( 'should have generated correct executors in modules', () => {

        const { user, home } = app1.modules;

        expect( user.executors ).toEqual( {} );
        expect( home.executors ).toHaveProperty( 'home' );
        expect( home.executors.home ).toHaveProperty( 'index' );
        expect( home.executors.home.index ).toBeInstanceOf( Function );
        expect( home.executors.home.index ).toBeInstanceOf( Function );

        expect( user.modules.home.executors ).toHaveProperty( 'home' );
        expect( user.modules.home.executors.home ).toHaveProperty( 'index' );
        expect( user.modules.home.executors.home.index ).toBeInstanceOf( Function );
    } );

    it( 'should respond expect data from executors in module', async () => {
        const res = await app1.handle( {
            request : {
                method : 'GET',
                url : '/home/home/index'
            }
        } );
        expect( res ).toBeInstanceOf( Context );
        expect( res.response.status ).toEqual( 200 );
        expect( res.response.body ).toEqual( responseData );
    } );

    it( 'should respond expect data from excutors in submodule of module', async () => {
        const res = await app1.handle( {
            request : {
                method : 'GET',
                url : '/user/home/home/index'
            }
        } );
        expect( res ).toBeInstanceOf( Context );
        expect( res.response.status ).toEqual( 200 );
        expect( res.response.body ).toEqual( responseData );
    } );

    describe( 'Interceptor decorators for modules', () => {
        it( 'should support response decorator', async () => {
            const context = await app1.handle( {
                request : {
                    method : 'GET',
                    url : '/info/home'
                }
            } );
            expect( context ).toBeInstanceOf( Context );
            const { response } = context;
            expect( response.status ).toEqual( 200 );
            expect( response.body ).toEqual( {
                status : 0,
                data : responseData
            } );
        } );

        it( 'should support request decorator', async () => {
            const res = await app1.handle( {
                request : {
                    method : 'GET',
                    url : '/info/home'
                }
            } );
            expect( res ).toBeInstanceOf( Context );
            expect( res.response.status ).toEqual( 200 );
            expect( res.__name ).toEqual( 'test' );
            expect( res.__package ).toEqual( 'ynn' );
        } );

        it( 'should support exception decorator', async () => {
            const context1 = await app1.handle( {
                request : {
                    method : 'GET',
                    url : '/error/error/bang'
                }
            } );

            expect( context1 ).toBeInstanceOf( Context );
            expect( context1.response.status ).toEqual( 500 );

            const context2 = await app1.handle( {
                request : {
                    method : 'GET',
                    url : '/error/error/suppress'
                }
            } );
            expect( context2 ).toBeInstanceOf( Context );
            expect( context2.response.status ).toEqual( 200 );
            expect( context2.response.body ).toEqual( { error : 0 } );
        } );
    } );
} );
