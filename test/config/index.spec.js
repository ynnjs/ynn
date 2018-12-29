const app = require( './app' );
const Ynn = require( '../..' );

require('max-listeners-exceeded-warning')();

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

    it( 'should overwrite the config item in parent module with NULL', () => {
        expect( app.find( 'sub2' ).config( 'common.data' ) ).toEqual( null ); 
        expect( app.find( 'sub2' ).config( 'common.data.x' ) ).toEqual( undefined ); 
        expect( app.find( 'sub2' ).config( 'common.data', 'x' ) ).toEqual( null ); 
        expect( app.find( 'sub2' ).config( 'common.data.x', 'x' ) ).toEqual( 'x' ); 
    } );
} );
