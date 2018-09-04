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
                    token : 'b',
                    'rsc-header' : 'ms'
                } )
                .end( e => e ? done.fail( e ) : done() );
        } );

        it( 'get', done => {
            request( app.listen() ).get( '/rsc/get' )
                .expect( 200 )
                .expect( { 
                    status : 'RSC',
                    method : 'GET',
                    token : 'c',
                    'rsc-header' : 'ms'
                } )
                .end( e => e ? done.fail( e ) : done() );
        } );

        it( 'post', done => {
            request( app.listen() ).post( '/rsc/post' )
                .expect( 200 )
                .expect( { 
                    status : 'RSC',
                    method : 'POST',
                    token : 'b',
                    'rsc-header' : 'ms'
                } )
                .end( e => e ? done.fail( e ) : done() );
        } );

        it( '~', done => {
            request( app.listen() ).post( '/rsc/local' )
                .expect( 200 )
                .expect( { 
                    status : 'RSC',
                    method : 'POST',
                    token : 'b'
                } )
                .end( e => e ? done.fail( e ) : done() );
        } );

    } );

    describe( 'api', () => {
        it( 'post', done => {
            request( app.listen() ).post( '/rsc/apipost' )
                .expect( 200 )
                .expect( { 
                    method : 'POST',
                    token : 'b',
                    headers : {
                        api : 'test-post'
                    }
                } )
                .end( e => e ? done.fail( e ) : done() );
        } );

        it( 'get', done => {
            request( app.listen() ).post( '/rsc/apiget' )
                .expect( 200 )
                .expect( { 
                    method : 'GET',
                    token : 'b',
                    headers : {
                        api : 'test-get'
                    }
                } )
                .end( e => e ? done.fail( e ) : done() );
        } );
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
        } );

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
