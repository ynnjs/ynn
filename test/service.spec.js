const request = require( 'supertest' );
const app = require( './app' );
const Console = require( '../lib/console' );

require('max-listeners-exceeded-warning')();

app.debugging = Console.WARN | Console.ERROR;

describe( 'service', () => {

    beforeAll( () => app.ready() );

    it( 'call service', done => {
        request( app.listen() ).get( '/service/call' )
            .expect( 200 )
            .expect( {
                content : 'name'
            } )
            .end( err => err ? done.fail( err ) : done() );
    } );

    it( 'getting config in service', done => {
        request( app.listen() ).get( '/service/config' )
            .expect( 200 )
            .expect( {
                name : 'appp'
            } )
            .end( err => err ? done.fail( err ) : done() );
    } );

    it( 'pass arguments to service while initializing', done => {
        request( app.listen() ).get( '/service/arguments' )
            .expect( 200 )
            .expect( {
                content : 't'
            } )
            .end( err => err ? done.fail( err ) : done() );
    } );
} );
