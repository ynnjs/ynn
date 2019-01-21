const Ynn = require( '../..' );
const app = require( './app' );

describe( 'exception', () => {

    beforeAll( () => app.ready() ); 

    it( 'catch exceptions thrown in actions', async () => {
        app.onexception = function( e, ctx, rt ) {
            expect( rt instanceof Ynn.Runtime ).toBeTruthy();
            rt.response( {
                status : 1
            } );
        }

        const res = await app.sham( '/' );
        expect( res.status ).toEqual( 1 );
    } );

    it( 'catch exceptions thrown from routing callbacks', async () => {
        app.onexception = function( e, ctx, rt ) {
            expect( rt instanceof Ynn.Runtime ).toBeTruthy();
            rt.response( {
                status : 1
            } );
        }

        const res = await app.sham( '/exception' );
        expect( res.status ).toEqual( 1 );
    } );
} );
