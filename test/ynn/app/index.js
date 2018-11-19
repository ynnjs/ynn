#!/usr/bin/env node

const Ynn = require( '../../..' );
const app = new Ynn( {
    root : __dirname,
    debugging : Ynn.DEBUGGING_DANGER,
    logging : false,
    modules : {
        sub : '../sub',
        sub2 : '../sub2'
    },
    routers() {
        this.router.add( '/', ctx => {
            ctx.body = { status : 'OK' };
        } );
    }
} );
require.main === module && app.listen( Ynn.cargs.port );
module.exports = app;
