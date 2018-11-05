const app = require( './app' );
const Ynn = require( '../../lib/ynn' );
const C = require( '../../lib/constants' );

require('max-listeners-exceeded-warning')();

app.debugging = C.DEBUGGING_WARN | C.DEBUGGING_ERROR;

describe( 'config', () => {
    beforeAll( () => app.ready() );

    it( 'should use the config data from Ynn', () => {
        expect( app.config( 'app.service.path' ) ).toEqual( 'service' );
    } );

    it( 'should overwrite the config item defined in Ynn', () => {
        expect( app.config( 'app.view.path' ) ).toEqual( 'view-app' ); 
    } );

    it( 'should use the config items in sub module', () => {
        expect( app.find( 'sub' ).config( 'app.controller.path' ) ).toEqual( 'controller-sub-app' );
    } );

    it( 'should use the passed configuration while mounting the module', () => {
        expect( app.find( 'sub2' ).config( 'app.controller.path' ) ).toEqual( 'x' );
        
    } );

    it( 'should load the config file from the extra configDir', () => {
        expect( app.find( 'sub2' ).config( 'extra.view' ) ).toEqual( 'extra-view' ); 
    } );

    it( 'should ignore app.js in extra config directory', () => {
        expect( app.find( 'sub2' ).config( 'app.view.path' ) ).toEqual( 'view' );
        
    } );

    it( 'should use the specified config dir', done => {
        new Ynn( {
            root : __dirname,
            debugging : false,
            logging : false,
            configDir : './app/config'
        } ).ready().then( app => {
            expect( app.config( 'app.view.path' ) ).toEqual( 'view-app' );
            done();
        } );
    } );

    it( 'should overwrite the config item in parent module with NULL', () => {
        expect( app.find( 'sub2' ).config( 'common.data' ) ).toEqual( null ); 
        expect( app.find( 'sub2' ).config( 'common.data.x' ) ).toEqual( undefined ); 
        expect( app.find( 'sub2' ).config( 'common.data', 'x' ) ).toEqual( null ); 
        expect( app.find( 'sub2' ).config( 'common.data.x', 'x' ) ).toEqual( 'x' ); 
    } );

} );
