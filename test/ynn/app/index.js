#!/usr/bin/env node

const Ynn = require( '../../../lib/ynn' );
const app = new Ynn( {
    root : __dirname,
    debugging : false,
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
