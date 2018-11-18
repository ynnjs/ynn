const Ynn = require( '../../..' );

const app = new Ynn( {
    debugging : Ynn.DEBUGGING_DANGER,
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
