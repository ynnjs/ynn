const request = require( 'supertest');
const app = require( './app' );
const Console = require( '../lib/console' );

require('max-listeners-exceeded-warning')();

app.debugging = Console.WARN | Console.ERROR;


describe( 'rsc', () => {

    beforeAll( () => app.ready() );

    describe( 'request', () => {
        it( 'call', done => {
            request( app.listen() ).get( '/rsc/call' )
                .expect( 200 )
                .expect( { 
                    status : 'RSC',
                    method : 'GET',
                    token : 'b'
                } )
                .end( e => e ? done.fail( e ) : done() );
        } );

        it( 'get', done => {
            request( app.listen() ).get( '/rsc/get' )
                .expect( 200 )
                .expect( { 
                    status : 'RSC',
                    method : 'GET',
                    token : 'c'
                } )
                .end( e => e ? done.fail( e ) : done() );
        } );

        it( 'post', done => {
            request( app.listen() ).post( '/rsc/post' )
                .expect( 200 )
                .expect( { 
                    status : 'RSC',
                    method : 'POST',
                    token : 'b'
                } )
                .end( e => e ? done.fail( e ) : done() );
        }, 1000000 );

        it( 'api', done => {
            request( app.listen() ).post( '/rsc/api' )
                .expect( 200 )
                .expect( { 
                    status : 'RSC',
                    method : 'POST',
                    token : 'b'
                } )
                .end( e => e ? done.fail( e ) : done() );
        }, 1000000 );

    } );

    describe( 'events', () => {
        it( 'success', done => {
            request( app.listen() ).get( '/rsc/success' )
                .expect( 200 )
                .expect( {
                    status : 'OK',
                    onsuccess : true,
                    token : 'b'
                } )
                .end( e => e ? done.fail( e ) : done() );
        }, 1000000 );

        it( 'failure', done => {
            request( app.listen() ).get( '/rsc/failure' )
                .expect( 200 )
                .expect( {
                    status : 'OK',
                    onfailure : true,
                    token : 'b'
                } ) 
                .end( e => e ? done.fail( e ) : done() );
        } );
    } );
} );
