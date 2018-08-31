const request = require( 'supertest' );
const app = require( './app' );
const Console = require( '../lib/console' );

require('max-listeners-exceeded-warning')();

app.debugging = Console.WARN | Console.ERROR;

describe( 'error', () => {

    beforeAll( () => app.ready() );

    for( const item of [ 500, 502, 500, 403, 404 ] ) {
        it( `catch ${item}`, done => {
        request( app.listen() ).get( `/error/${item}` )
            .expect( item )
            .end( e => e ? done.fail( e ) : done() );
        } );
    }
} );
