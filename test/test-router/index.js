const Yolk = require( '../../lib/yolk' );

module.exports = new Yolk( {
    root : __dirname,
    routers() {
        this.router.get( '/respond-directly', ctx => {
            ctx.body = {
                status : 'OK'
            };
        } );
    }
} );
