const is = require( '@lvchengbin/is' );
const Plugin = require( '../../lib/plugin' );
const app = require( './app' );

describe( 'Ynn Plugins', () => {

    beforeAll( () => app.ready() );

    it( 'plugin', () => {
        expect( app.redis ).toEqual( 'redis' );
        expect( app[ 'another-redis' ] ).toEqual( 'redis' );
        const test = new app.ExtendsPlugin( app );
        expect( test instanceof Plugin ).toBeTruthy();
        expect( is.class( app.OrdinaryClass ) ).toBeFalsy();
    } ); 
    
} );
