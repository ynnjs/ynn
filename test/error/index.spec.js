const request = require( 'supertest' );
const mockConsole = require( 'jest-mock-console' );
const app = require( './app' );

require('max-listeners-exceeded-warning')();

describe( 'error', () => {

    let restoreConsole;

    beforeAll( () => app.ready() );

    beforeAll( () => {
        restoreConsole = mockConsole();
    } );

    afterAll( () => restoreConsole() );

    for( const item of [ 500, 502, 500, 403, 404 ] ) {
        it( `catch ${item}`, done => {
            request( app.listen() ).get( `/index/e${item}` )
                .expect( item )
                .end( e => e ? done.fail( e ) : done() );
        } );
    }

    it( 'error in action', done => {
        request( app.listen() ).get( '/index/error' )
            .expect( 401 )
            .end( e => e ? done.fail( e ) : done() );
    } );
} );
