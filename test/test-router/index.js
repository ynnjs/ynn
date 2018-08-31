const Ynn = require( '../../lib/ynn' );

module.exports = new Ynn( {
    root : __dirname,
    routers() {
        this.router.get( '/respond-directly', ctx => {
            ctx.body = {
                status : 'OK'
            };
        } );
    }
} );
