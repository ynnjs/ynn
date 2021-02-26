/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: test/index.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/10/2021
 * Description:
 ******************************************************************/

import Ynn, { Action, Controller } from '../src';

describe( '', () => {
    it( '', async () => {

        const fn = jest.fn();

        class HomeController extends Controller {
            @Action()
            index() {
                fn();
                return { status : 0 };
            }
        }

        const app = new Ynn( {
            controllers : {
                home : HomeController
            }
        } );

        expect( app.controllers ).toHaveProperty( 'home' );
        expect( app.actions ).toHaveProperty( 'home' );
        expect( app.actions.home ).toHaveProperty( 'index' );
        await app.handle( {
            request : {
                method : 'GET',
                url : '/home'
            },
            response : {}
        } );

        expect( fn ).toHaveBeenCalled();
    } );
} );
