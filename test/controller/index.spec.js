const request = require( 'supertest' );
const app = require( './app' );

require('max-listeners-exceeded-warning')();

describe( 'service', () => {

    beforeAll( () => app.ready() );

    it( 'should execute action after the controller got ready', done => {
        request( app.listen() ).get( '/' )
            .expect( 200 )
            .expect( {
                ready : true 
            } )
            .end( err => err ? done.fail( err ) : done() );
    } );

    it( 'should set response with ctx.body', done => {
        request( app.listen() ).get( '/index/raw' )
            .expect( 200 )
            .expect( 'Hello Ynn!' )
            .end( err => err ? done.fail( err ) : done() );
    } );

} );
