const path = require( 'path' );
const request = require( 'supertest' );
const Ynn = require( '../../' );
const app = require( './app' );

require('max-listeners-exceeded-warning')();

const ctx = {};
ctx.app = app;

describe( 'Ynn view', () => {

    beforeAll( () => app.ready() );

    describe( 'using the default engine', () => {
        it( 'should respond the parsed content', done => {
            request( app.listen() ).get( '/index' )
                .expect( 200 )
                .expect( 'Content-Type', 'text/html; charset=utf-8' )
                .expect( 'Rendered HTML' )
                .end( e => e ? done.fail( e ) : done() ); 
        } );

        it( 'the render function declared in config should get corrent arguments', async () => {
            const runtime = new Ynn.Runtime( ctx );
            await runtime.ready();
            return expect( runtime.render( 'index.tpl', {
                title : '<Hello Ynn!>'
            } ) ).resolves.toEqual( {
                data : {
                    title : '<Hello Ynn!>'
                },
                file : path.resolve( app.root, app.config( 'view.path' ), 'index.tpl' ),
            } );
        } );
    } );
    
} );
