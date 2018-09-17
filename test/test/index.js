const Ynn = require( '../../lib/ynn' );

const app = new Ynn( {
    root : __dirname,
    logging : Ynn.LOGGING_DISABLE_ALL,
    routers() {
        this.router.get( '/', ctx => {
            ctx.body = { status : 'OK' };
        } );
    },
    modules : {
        str : '../str'
    }
} );

app.keys = [ 'test' ];

app.use( ( ctx, next ) => {
    ctx.cookies.set( 'sex', 'tobi', { signed : true } );
    return next();
} );

if( require.main === module ) {
    app.listen();
}

app.ready().then( () => {
    app.logger.log( 'error', 'xxxxxxxxxxxxx' );
} );

module.exports = app;
