const Ynn = require( '../../lib/ynn' );

const app = new Ynn( {
    root : __dirname,
    static : {
        '/static/(.*)' : '.'
    }
} );

app.keys = [ 'xxxx' ];
app.use( ( ctx, next ) => {
    ctx.cookies.set( 'name', 'tobi', { signed : true } );
    return next();
} );

module.exports = app;
