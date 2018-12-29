const Ynn = require( '../..' );

const app = new Ynn( {
    root : __dirname,
    debugging : Ynn.DEBUGGING_DANGER,
    logging : false,
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
