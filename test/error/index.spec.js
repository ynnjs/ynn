const request = require( 'supertest' );
const app = require( './app' );

require('max-listeners-exceeded-warning')();

describe( 'error', () => {

    beforeAll( () => app.ready() );

    for( const item of [ 500, 502, 500, 403, 404 ] ) {
        it( `catch ${item}`, done => {
        request( app.listen() ).get( `/index/e${item}` )
            .expect( item )
            .end( e => e ? done.fail( e ) : done() );
        } );
    }
} );
