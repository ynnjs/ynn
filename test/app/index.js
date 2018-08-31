const Yolk = require( '../../lib/yolk' );

const app = new Yolk( {
    root : __dirname
} );

app.keys = [ 'xxxx' ];
app.use( ( ctx, next ) => {
    ctx.cookies.set( 'name', 'tobi', { signed : true } );
    return next();
} );

module.exports = app;
