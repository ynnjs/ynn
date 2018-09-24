const Ynn = require( '../../lib/ynn' );

const app = new Ynn( {
    root : __dirname,
    static : {
        '/static/(.*)' : '.'
    },
    routers() {
        this.router.add( '/', ctx => {
            ctx.body = ctx.method;
        } );
    }
} );

app.listenIPCSocket( '/var/tmp/ynn.sock' );
module.exports = app;
