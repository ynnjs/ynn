const Ynn = require( '../..' );

describe( 'methods', () => {
    describe( 'assert', () => {
        it( 'error', async done => {
            const app = new Ynn( {
                root : __dirname,
                debugging : Ynn.DEBUGGING_DANGER,
                logging : false,
                routers() {
                    this.router.add( '/', ( ctx, next, rt ) => {
                        rt.assert( ctx.query.id )
                            .is( 'int', 400, 'id should be an integer' )
                            .value();
                    } );
                }
            } );

            await app.ready();

            app.sham( '/' ).catch( res => {
                expect( res.statusCode ).toEqual( 400 );
                //console.log( res.ctx.body );
                //expect( e.body ).toEqual( 'id should be an integer' );
                done();
            } );
        } );

        it( 'pass', async done => {
            const app = new Ynn( {
                root : __dirname,
                debugging : Ynn.DEBUGGING_DANGER,
                logging : false,
                routers() {
                    this.router.add( '/', ( ctx, next, rt ) => {
                        const id = rt.assert( ctx.query.id )
                            .is( 'int', 400, 'id shoud be an integer' )
                            .value();
                        ctx.body = { id };
                    } );
                }
            } );

            await app.ready();

            app.sham( '/?id=100' ).then( res => {
                expect( res ).toEqual( { id : '100' } );
                done();
            } );
        } );
    } )
} );
