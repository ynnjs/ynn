/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: utils/action-scan.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/30/2020
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import { scan, Action } from '../src/action';

describe( 'utils.scan', () => {

    it( 'should pick methods whose name ends with "Action"', () => {
        const controller = {
            indexAction() {},
            fn() {}
        };

        const actions = scan( controller );

        expect( actions ).not.toHaveProperty( 'fn' );
        expect( actions ).toHaveProperty( 'index' );
        expect( actions.index.methodName ).toEqual( 'indexAction' );
        expect( actions.index.descriptor ).toHaveProperty( 'value', controller.indexAction );
    } );

    it( 'should collect methods decorated with @Action() decorator', () => {
        class Controller {
            @Action()
            index() {}

            fn() {}
        }

        const actions = scan( Controller.prototype );

        expect( actions ).not.toHaveProperty( 'fn' );
        expect( actions ).toHaveProperty( 'index' );
        expect( actions.index.methodName ).toEqual( 'index' );
        expect( actions.index.descriptor ).toHaveProperty( 'value', Controller.prototype.index );
    } );

    it( 'should support specifying action name with @Action() decorator', () => {

        class Controller {
            @Action( 'home' )
            index() {}

            fn() {}
        }

        const actions = scan( Controller.prototype );

        expect( actions ).not.toHaveProperty( 'index' );
        expect( actions ).toHaveProperty( 'home' );
        expect( actions.home.methodName ).toEqual( 'index' );
        expect( actions.home.descriptor ).toHaveProperty( 'value', Controller.prototype.index );
    } );

    it( 'should support using @Action() decorator multiple times for one method', () => {

        class Controller {
            @Action()
            @Action( 'home' )
            @Action( 'another' )
            index() {}
        }

        const actions = scan( Controller.prototype );

        expect( actions ).toHaveProperty( 'home' );
        expect( actions ).toHaveProperty( 'index' );
        expect( actions ).toHaveProperty( 'another' );
        expect( actions.home.methodName ).toEqual( 'index' );
        expect( actions.home.descriptor ).toHaveProperty( 'value', Controller.prototype.index );

        expect( actions.index.methodName ).toEqual( 'index' );
        expect( actions.index.descriptor ).toHaveProperty( 'value', Controller.prototype.index );

        expect( actions.another.methodName ).toEqual( 'index' );
        expect( actions.another.descriptor ).toHaveProperty( 'value', Controller.prototype.index );
    } );

    it( 'should support using @Action() decorator for method has name end with "Action"', () => {

        class Controller {
            @Action()
            @Action( 'home' )
            indexAction() {}
        }

        const actions = scan( Controller.prototype );

        expect( actions ).toHaveProperty( 'home' );
        expect( actions ).toHaveProperty( 'index' );
        expect( actions ).toHaveProperty( 'indexAction' );
        expect( actions.home.methodName ).toEqual( 'indexAction' );
        expect( actions.home.descriptor ).toHaveProperty( 'value', Controller.prototype.indexAction );

        expect( actions.index.methodName ).toEqual( 'indexAction' );
        expect( actions.index.descriptor ).toHaveProperty( 'value', Controller.prototype.indexAction );

        expect( actions.indexAction.methodName ).toEqual( 'indexAction' );
        expect( actions.indexAction.descriptor ).toHaveProperty( 'value', Controller.prototype.indexAction );
    } );

    it( 'should not override action specified with @Action() by xxxAction method', () => {

        class Controller {
            @Action( 'home' )
            indexAction() {}

            @Action( 'index' )
            fn() {}
        }

        const actions = scan( Controller.prototype );

        expect( actions.index.methodName ).toEqual( 'fn' );
        expect( actions.home.methodName ).toEqual( 'indexAction' );
    } );
} );
