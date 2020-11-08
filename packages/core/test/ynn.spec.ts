/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: test/ynn.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/06/2020
 * Description: 
 ******************************************************************/

import { mockProcessStdout } from 'jest-mock-process';
import Koa from '@ynn/koa';
import Router from '../src/router';
import Logger from '../src/logger';
import Ynn from '../src/ynn';

describe( 'Ynn', () => {
    describe( 'Ynn instance', () => {
        it( 'should extend from @ynn/koa', () => {
            const app = new Ynn();        
            expect( app ).toBeInstanceOf( Koa );
        } );
    } );

    describe( 'Ynn.logger', () => {

        let mockStdout;

        beforeEach( () => {
            mockStdout = mockProcessStdout()
        } );

        afterEach( () => {
            mockStdout.mockRestore();
        } );

        it( 'should be Proxy<{}> is logger is not given in options', () => {
            const app = new Ynn( { debugging : true } );        
            expect( app ).toHaveProperty( 'logger', {} );
            expect( app.logger.log ).toBeInstanceOf( Function );
        } );

        it( 'should call method of debug if debugging is true', () => {
            
        } );
    } );

    describe( 'Ynn.router', () => {
        it( 'should have instance member router', () => {
            const app = new Ynn();        
            expect( app ).toHaveProperty( 'router' );
            expect( app.router ).toBeInstanceOf( Router );
        } );

        it( 'should have called options.routers if options.routers is a function', () => {
            const routers = jest.fn();
            const app = new Ynn( { routers } ); 
            expect( routers ).toHaveBeenCalledWith( app.router, app );
        } );

        it( '', () => {
            const app = new Ynn( {
                routers : [
                    [ '/user/:id', 'user.index' ],
                    [ /^user\/\d+/, 'user.profile' ],
                    [ 'get', /^user\/profile/, 'user.profile' ],
                    [ [ 'get', 'post' ], '/user/profile/save', 'user.saveProfile' ],
                    [ '/user', ( ctx, next ) => {
                    } ]
                ]
            } ); 
        } );
    } );

    describe( 'Ynn.config', () => {
        it( 'should have instance member config', () => {
            const app = new Ynn();        
            expect( app ).toHaveProperty( 'config' );
        } );
    } );
} );
