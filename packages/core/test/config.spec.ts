/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: test/config.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/28/2020
 * Description: 
 ******************************************************************/

import Config from '../src/config';

const c = {
    debugging : false,
    app : {
        name : 'ynn',
        path : null
    }
}

const config = new Config( c );

describe( 'Config', () => {
    it( 'should get the corrent value', () => {
        expect( config.get( 'debugging' ) ).toEqual( c.debugging );    
    } );

    it( 'should parse multiple level path', () => {
        expect( config.get( 'app.name' ) ).toEqual( c.app.name );    
    } );

    it( 'should not use the default value if the value in config is NULL', () => {
        expect( config.get( 'app.path', 'default path' ) ).toEqual( null );    
    } );

    it( 'should use the default if the value is undefined', () => {
        const d = 'default path';
        expect( config.get( 'app.????', d ) ).toEqual( d );    
    } );

    it( 'should return the entire config object', () => {
        expect( config.get() ).toEqual( c );    
    } );

    it( 'should support wrapping an non-object value', () => {
        expect( new Config().get( 'app.name', 'default name' ) ).toEqual( 'default name' );
    } );

} );
