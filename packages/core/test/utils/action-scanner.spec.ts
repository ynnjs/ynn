/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: utils/action-scanner.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/30/2020
 * Description: 
 ******************************************************************/

import 'reflect-metadata';
import scanner from '../../src/utils/action-scanner';
import Action from '../../src/decorators/action.decorator';

describe( 'utils.scanner', () => {

    it( 'should pick methods whose name ends with "Action"', () => {
        const controller = {
            indexAction() {},
            fn() {}
        }

        const actions = scanner( controller );
 
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

        const actions = scanner( Controller.prototype );

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

        const actions = scanner( Controller.prototype );

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

        const actions = scanner( Controller.prototype );

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

        const actions = scanner( Controller.prototype );

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
        
    } );
} );
