/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: test/index.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/10/2021
 * Description:
 ******************************************************************/

import Waka, { Action, Controller } from '../src';

describe( '', () => {
    it( '', async () => {

        const fn = jest.fn();

        class HomeController extends Controller {
            @Action()
            index() {
                fn();
                console.log( this.ctx );
                return { status : 0 };
            }
        }

        const waka = new Waka( {
            controllers : {
                home : HomeController
            }
        } );

        expect( waka.controllers ).toHaveProperty( 'home' );
        expect( waka.actions ).toHaveProperty( 'home' );
        expect( waka.actions.home ).toHaveProperty( 'index' );
        const response = await waka.handle( {
            request : {
                method : 'GET',
                url : '/home'
            },
            response : {}
        } );

        console.log( response );

        expect( fn ).toHaveBeenCalled();
    } );
} );
