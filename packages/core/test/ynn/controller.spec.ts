/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: ynn/controller.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/09/2020
 * Description: 
 ******************************************************************/

import Controller from '../../src/controller';
import Ynn, { Req } from '../helpers/ynn';

describe( 'ynn.controllers', () => {
      
    it( 'should have controllers property in Ynn instance', () => {
        const app = new Ynn();
        expect( app ).toHaveProperty( 'controllers', {} );
    } );

    it( 'should add given controllers into Ynn.controllers', () => {
        const controller1 = () => {};
        const controller2 = class extends Controller {};
        const app = new Ynn( {
            controllers : { controller1, controller2 }
        } );
        expect( app ).toHaveProperty( 'controllers', {
            controller1, controller2
        } );
    } );

    it( 'should clone a new controllers object from given controllers', () => {
        const controller1 = () => {};
        const controller2 = class extends Controller {};
        const controllers = { controller1, controller2 };
        const app = new Ynn( { controllers } );
        expect( app.controllers ).toEqual( controllers );
        expect( app.controllers ).not.toBe( controllers );
    } );

    it( 'should execute function controller', done => {
        
        const app = new Ynn( {
            controllers : {
                user : ctx => {
                    expect( ctx.path ).toEqual( '/user' );
                    done();
                }
            }
        } );

        app.$( {
            req : new Req( { url : '/user' } )
        } );
    } );

    it( 'should execute controller extends Controller', done => {
        const app = new Ynn( {
            controllers : {
                user : class extends Controller {
                    profileAction( ctx ) {
                        expect( ctx.path ).toEqual( '/user/profile' );
                        done();
                    }
                }
            }
        } );

        app.$( {
            req : new Req( { url : '/user/profile' } )
        } );
    } );
} );
