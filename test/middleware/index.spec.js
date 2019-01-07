const Ynn = require( '../..' );
const request = require( 'supertest' );
const app = require( './app' );

require('max-listeners-exceeded-warning')();

describe( 'middleware', () => {
    beforeAll( () => app.ready() );

    it( 'get', done => {
        request( app.listen() ).get( '/' )
            .expect( 200 )
            .expect( 'Hi!Hello Ynn!' )
            .end( err => err ? done.fail( err ) : done() );
    } );

    it( 'complex post', done => {
        request( app.listen() ).post( '/complex/post' )
            .expect( 200 )
            .expect( 'Hi!Hello Ynn!' )
            .end( err => err ? done.fail( err ) : done() );
    } );

    it( 'add', done => {
        request( app.listen() ).post( '/add' )
            .expect( 200 )
            .expect( 'Hi!Hello Ynn!' )
            .end( err => err ? done.fail( err ) : done() );
    } );

    it( 'complex add', done => {
        request( app.listen() ).post( '/complex/add' )
            .expect( 200 )
            .expect( 'Hi!Hello Ynn!' )
            .end( err => err ? done.fail( err ) : done() );
    } );

    it( 'Middleware instance', done => {
        const app = new Ynn( {
            debugging : Ynn.DEBUGGING_DANGER,
            logging : false,
            routers() {
                this.router.get( '/runtime', class extends Ynn.Middleware {
                    execute() {
                        return {
                            runtime : true
                        }
                    }
                } );
            }
        } );
        app.ready().then( () => {
            request( app.listen() ).get( '/runtime' )
                .expect( 200 )
                .expect( {
                    runtime : true
                } ) 
                .end( err => err ? done.fail( err ) : done() );
        } );
    } );

    it( 'Middleware instance with calling next', done => {
        const app = new Ynn( {
            debugging : Ynn.DEBUGGING_DANGER,
            logging : false,
            routers() {
                this.router.get( '/runtime', [
                    class extends Ynn.Middleware {
                        execute() {
                            this.ctx.body = 'Hi!';
                            this.next();
                        }
                    },
                    ctx => {
                        ctx.body += 'Hello Ynn!';
                    }
                ] );
            }
        } );
        app.ready().then( () => {
            request( app.listen() ).get( '/runtime' )
                .expect( 200 )
                .expect( 'Hi!Hello Ynn!' ) 
                .end( err => err ? done.fail( err ) : done() );
        } );
    } );

    it( 'Middleware instance with throwing exception', done => {
        const app = new Ynn( {
            debugging : Ynn.DEBUGGING_DANGER,
            logging : false,
            routers() {
                this.router.get( '/runtime', [
                    class extends Ynn.Middleware {
                        execute() {
                            this.throw( 401 );
                        }
                    },
                    ctx => {
                        ctx.body += 'Hello Ynn!';
                    }
                ] );
            }
        } );
        app.ready().then( () => {
            request( app.listen() ).get( '/runtime' )
                .expect( 401 )
                .end( err => err ? done.fail( err ) : done() );
        } );
    } );
} );
