#!/usr/bin/env node

const Ynn = require( '../../..' );
const app = new Ynn( {
    root : __dirname,
    debugging : Ynn.DEBUGGING_DANGER,
    logging : false,
    modules : {
        test : '../sub'
    }
} );
require.main === module && app.listen( Ynn.cargs.port );
module.exports = app;
