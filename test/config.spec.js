const request = require( 'supertest' );
const app = require( './app' );
const Console = require( '../lib/console' );

require('max-listeners-exceeded-warning')();

app.debugging = Console.WARN | Console.ERROR;

describe( 'config', () => {
    beforeAll( () => app.ready() );

    it( 'local configurations', done => {
        request( app.listen() ).get( '/config/item/local' )
            .expect( 200 )
            .expect( { level : 'local' } )
            .end( e => e ? done.fail( e ) : done() );  
    } );

    it( 'specified config dir', done => {
        request( app.listen() ).get( '/config/item/specifiedConfigDir' )
            .expect( 200 )
            .expect( { level : 'specified' } )
            .end( e => e ? done.fail( e ) : done() );  
    } );

    it( 'runtime config', done => {
        request( app.listen() ).get( '/config/item/runtime' )
            .expect( 200 )
            .expect( { level : 'runtime' } )
            .end( e => e ? done.fail( e ) : done() );  
    } );
} );
