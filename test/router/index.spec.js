const Ynn = require( '../..' );
const request = require( 'supertest' );
const app = require( './app' );

describe( 'Ynn Router', () => {
    beforeAll( () => app.ready() );
    describe( 'Default Rules', () => {
        it( 'should have used the "index" controller and "index" action as default', done => {
            request( app.listen() ).get( '/' )
                .expect( 200 )
                .expect( '/index/index' )
                .end( err => err ? done.fail( err ) : done() );
        } ); 

        it( 'should have used the "index" action as default.', done => {
            request( app.listen() ).get( '/index' )
                .expect( 200 )
                .expect( '/index/index' )
                .end( err => err ? done.fail( err ) : done() );
        } ); 
            
        it( 'should have been routed to correct controller and correct action', done => {
            request( app.listen() ).get( '/index/index' )
                .expect( 200 )
                .expect( '/index/index' )
                .end( err => err ? done.fail( err ) : done() );
        } ); 

        it( 'should have routed to the mounted submodule', done => {
            request( app.listen() ).get( '/submodule/ping' )
                .expect( 200 )
                .expect( 'submodule ping' )
                .end( err => err ? done.fail( err ) : done() );
        } );
    } );

    describe( 'Rules for static files', () => {
        it( 'should have gotten plain content from txt file', done => {
            request( app.listen() ).get( '/static/abc.txt' )
                .expect( 200 )
                .expect( 'Content-Type', 'text/plain; charset=utf-8' )
                .expect( 'abc\n' )
                .end( err => err ? done.fail( err ) : done() );
        } );

        it( 'should have gotten js content from js file', done => {
            request( app.listen() ).get( '/static/index.js' )
                .expect( 200 )
                .expect( 'Content-Type', 'application/javascript; charset=utf-8' )
                .expect( 'test\n' )
                .end( err => err ? done.fail( err ) : done() );
        } );

        it( 'should have gotten css content from css file', done => {
            request( app.listen() ).get( '/static/index.css' )
                .expect( 200 )
                .expect( 'Content-Type', 'text/css; charset=utf-8' )
                .expect( 'test\n' )
                .end( err => err ? done.fail( err ) : done() );
        } );

        it( 'should have gotten html content from html file', done => {
            request( app.listen() ).get( '/static/index.html' )
                .expect( 200 )
                .expect( 'Content-Type', 'text/html; charset=utf-8' )
                .expect( 'test\n' )
                .end( err => err ? done.fail( err ) : done() );
        } );

        it( 'should have supported multiple static routing rules', done => {
            request( app.listen() ).get( '/files/index.html' )
                .expect( 200 )
                .expect( 'Content-Type', 'text/html; charset=utf-8' )
                .expect( 'test\n' )
                .end( err => err ? done.fail( err ) : done() );
            
        } );

    } );

    describe( 'Custom rules', () => {
        describe( 'Simple rules', () => {
            it( 'should have used the correct simple routing rules.', done => {
                const app = new Ynn( {
                    debugging : Ynn.DEBUGGING_DANGER,
                    logging : false,
                    routers() {
                        this.router.get( '/custom', ctx => {
                            ctx.body = 'custom';
                        } );
                    }
                } );
                app.ready().then( () => {
                    request( app.listen() ).get( '/custom' )
                        .expect( 200 )
                        .expect( 'custom' ) 
                        .end( err => err ? done.fail( err ) : done() );
                } );
            } );
        } );

        describe( 'Rules to another action', () => {
            it( 'should have been routed to correct controller/action 1', done => {
                request( app.listen() ).get( '/custom/rule/to/action' )
                    .expect( 200 )
                    .expect( '/index/custom' )
                    .end( err => err ? done.fail( err ) : done() );
            } );

            it( 'should have been routed to correct controller/action 2', done => {
                request( app.listen() ).get( '/custom/rule/to/action/2' )
                    .expect( 200 )
                    .expect( '/index/custom' )
                    .end( err => err ? done.fail( err ) : done() );
            } );

            it( 'should have been routed to correct controller/action 3', done => {
                request( app.listen() ).get( '/custom/rule/to/action/3' )
                    .expect( 200 )
                    .expect( '/index/custom' )
                    .end( err => err ? done.fail( err ) : done() );
            } );

            it( 'should have been routed to correct controller/action 4', done => {
                request( app.listen() ).get( '/custom/rule/to/action/4' )
                    .expect( 200 )
                    .expect( '/index/custom' )
                    .end( err => err ? done.fail( err ) : done() );
            } );
        } );

        describe( 'Rules to another module', () => {
            it( 'should have routed to another module without modifying the original path', done => {
                request( app.listen() ).get( '/custom/rule/to/module/without/modifying/original/path' )
                    .expect( 200 )
                    .expect( '/custom/rule/to/module/without/modifying/original/path' )
                    .end( err => err ? done.fail( err ) : done() );
            } );

            it( 'should have routed to another module with a new path', done => {
                request( app.listen() ).get( '/custom/rule/to/module/with/a/new/path' )
                    .expect( 200 )
                    .expect( 'submodule ping' )
                    .end( err => err ? done.fail( err ) : done() );
            } );
        } );
    } );
} );
