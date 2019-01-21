const Ynn = require( '../../..' );

const app = new Ynn( {
    debugging : Ynn.DEBUGGING_DANGER,
    logging : false,
    root : __dirname,
    routers() {
        this.router.add( '/exception', ctx => {
            ctx.throw( 400 );
        } );
    }
} );

module.exports = app;
