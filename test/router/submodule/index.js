const Ynn = require( '../../../lib/ynn' );

const app = new Ynn( {
    debugging : false,
    logging : false,
    root : __dirname,
    routers() {
        this.router.get( '/ping', ctx => {
            ctx.body = 'submodule ping';
        } );

        this.router.get( '/custom/rule/to/module/without/modifying/original/path', ctx => {
            ctx.body = ctx.path;
        } );
    }
} );

module.exports = app;
