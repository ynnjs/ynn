const app = require( './app' );
const request = require( 'supertest' );

require('max-listeners-exceeded-warning')();


describe( 'Ynn view', () => {

    beforeAll( () => app.ready() );

    describe( 'using the default engine', () => {
        it( 'should respond the parsed content', done => {
            request( app.listen() ).get( '/index' )
                .expect( 200 )
                .expect( '&lt;Hello Ynn!&gt;\n' )
                .end( e => e ? done.fail( e ) : done() ); 
        } );
    } );
    
} );
