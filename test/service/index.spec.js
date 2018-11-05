const request = require( 'supertest' );
const app = require( './app' );

require('max-listeners-exceeded-warning')();

describe( 'service', () => {

    beforeAll( () => app.ready() );

    it( 'call service', done => {
        request( app.listen() ).get( '/index/call' )
            .expect( 200 )
            .expect( {
                content : 'name'
            } )
            .end( err => err ? done.fail( err ) : done() );
    } );

    it( 'getting config in service', done => {
        request( app.listen() ).get( '/index/config' )
            .expect( 200 )
            .expect( {
                name : 'appp'
            } )
            .end( err => err ? done.fail( err ) : done() );
    } );

    it( 'pass arguments to service while initializing', done => {
        request( app.listen() ).get( '/index/arguments' )
            .expect( 200 )
            .expect( {
                content : 't'
            } )
            .end( err => err ? done.fail( err ) : done() );
    } );
} );
