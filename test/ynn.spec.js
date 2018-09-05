const request = require( 'supertest' );
const app = require( './app' );
const test = require( './test' );
const Console = require( '../lib/console' );

require('max-listeners-exceeded-warning')();

app.debugging = Console.WARN | Console.ERROR;
test.debugging = Console.WARN | Console.ERROR;

describe( 'Ynn', () => {
    beforeAll( () => Promise.all( [ app.ready(), test.ready() ] ) );

    describe( 'basic', () => {
        it( 'static files', done => {
            request( app.listen() ).get( '/static/js/index.js' )
                .expect( 200 )
                .end( err => err ? done.fail( err ) : done() );
        } ); 
    } );

    describe( 'router', () => {
        describe( 'load rules', () => {
            
            it( 'respond directly in separated routers.js', done => {
                request( app.listen() ).get( '/for-testing-routers' )
                    .expect( 200 )
                    .expect( {
                        status : 'OK'
                    } )
                    .end( err => err ? done.fail( err ) : done() );
            } );
            
            it( 'respond directly in separated routers.js with an async function', done => {
                request( app.listen() ).get( '/async' )
                    .expect( 200 )
                    .expect( {
                        status : 'OK'
                    } )
                    .end( err => err ? done.fail( err ) : done() );
            } );

            it( 'add routers with routers property', done => {
                request( test.listen() ).get( '/' )
                    .expect( 200 )
                    .expect( {
                        status : 'OK'
                    } )
                    .end( err => err ? done.fail( err ) : done() );
            } );

        } );

        describe( 'default rules', () => {
            
            it( '/:module/respond-directly', done => {
                request( app.listen() ).get( '/test-router/respond-directly' )
                    .expect( 200 )
                    .expect( {
                        status : 'OK'
                    } )
                    .end( err => err ? done.fail( err ) : done() );
            } );

            it( '/:module/:controller/:action', done => {
                request( app.listen() ).get( '/test-router/index/action' )
                    .expect( 200 )
                    .expect( {
                        status : 'OK'
                    } )
                    .end( e => e ? done.fail( e ) : done() ); 
            } );
            
            it( '/:module/:controller/{default action}', done => {
                request( app.listen() ).get( '/test-router/index' )
                    .expect( 200 )
                    .expect( {
                        status : 'OK'
                    } )
                    .end( e => e ? done.fail( e ) : done() ); 
            } );

            it( '/:module/{default controller}/{default action}', done => {
                request( app.listen() ).get( '/test-router' )
                    .expect( 200 )
                    .expect( {
                        status : 'OK'
                    } )
                    .end( e => e ? done.fail( e ) : done() ); 
            } );

            it( '/{default module}/{default controller}/{default action}', done => {
                request( app.listen() ).get( '/' )
                    .expect( 200 )
                    .expect( {
                        status : 'OK'
                    } )
                    .end( e => e ? done.fail( e ) : done() ); 
            } );

            it( '/:module1/:module2/controller/action', done => {
                request( app.listen() ).get( '/test/str/random' )
                    .expect( 200 )
                    .expect( {
                        status : 'OK'
                    } )
                    .end( e => e ? done.fail( e ) : done() ); 
            } );

        } );

        describe( 'customized rules', () => {
            it( '/:module', done => {
                request( app.listen() ).get( '/to-test-router' )
                    .expect( 200 )
                    .expect( {
                        status : 'OK'
                    } )
                    .end( e => e ? done.fail( e ) : done() ); 
            } ); 

            it( '/:controller/:action', done => {
                request( app.listen() ).get( '/customize/action' )
                    .expect( 200 )
                    .expect( {
                        status : 'OK'
                    } )
                    .end( e => e ? done.fail( e ) : done() ); 
            } );
        } );
    } );

    describe( 'runtime', () => {
        it( 'responseType = jsonp', done => {
            request( app.listen() ).get( '/runtime?responseType=jsonp' )
                .expect( 200 )
                .expect( 'callback({"status":"OK"})' )
                .end( err => err ? done.fail( err ) : done() );
        } ); 

        it( 'respond jsonp', done => {
            request( app.listen() ).get( '/runtime/jsonp' )
                .expect( 200 )
                .expect( 'callback({"status":"OK"})' )
                .end( err => err ? done.fail( err ) : done() );
        } );

        it( 'attachment', done => {
            request( app.listen() ).get( '/runtime/attachment' )
                .expect( 200 )
                .expect( ( res ) => {
                    res.res.on( 'readable', data => {
                        console.log( data );
                    } );
                    res.res.read();
                } )
                .end( err => err ? done.fail( err ) : done() );
        } );

    } );

} );

