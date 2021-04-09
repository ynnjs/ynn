/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: test/index.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/10/2021
 * Description:
 ******************************************************************/

import { Ynn, Action, Context, Module, Options } from '../src';

describe( 'Ynn application', () => {

    class HomeController {
        @Action()
        index() {
            return { status : 0 };
        }
    }

    @Module()
    class UserModule {}

    @Module( {
        controllers : {
            home : HomeController
        }
    } )
    class HomeModule {}

    const options: Options = {
        controllers : {
            home : HomeController
        },
        modules : {
            user : UserModule,
            home : HomeModule
        }
    };

    const app1 = new Ynn( options );

    @Module( options )
    class IndexModule {}

    const app2 = Ynn.create( IndexModule );

    describe( 'create Ynn instance directly', () => {
        it( 'should have basic properties', async () => {
            expect( app1.controllers ).toHaveProperty( 'home' );
            expect( app1.executors ).toHaveProperty( 'home' );
            expect( app1.executors.home ).toHaveProperty( 'index' );
        } );

        it( 'should respond expect data', async () => {
            const res = await app1.handle( {
                request : {
                    method : 'GET',
                    url : '/home'
                },
                response : {}
            } );

            expect( res ).toBeInstanceOf( Context );
            expect( res.body ).toEqual( { status : 0 } );
        } );
    } );

    describe( 'create Ynn instance with Ynn.create', () => {
        it( 'should have basic properties', async () => {
            expect( app2.controllers ).toHaveProperty( 'home' );
            expect( app2.executors ).toHaveProperty( 'home' );
            expect( app2.executors.home ).toHaveProperty( 'index' );
        } );

        it( 'should respond expect data', async () => {
            const res = await app2.handle( {
                request : {
                    method : 'GET',
                    url : '/home'
                },
                response : {}
            } );

            expect( res ).toBeInstanceOf( Context );
            expect( res.body ).toEqual( { status : 0 } );
        } );
    } );
} );
