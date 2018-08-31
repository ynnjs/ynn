const Yolk = require( '../../lib/yolk' );

const app = new Yolk( {
    root : __dirname,
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

module.exports = app;
