#!/usr/bin/env node

const Ynn = require( '../../../lib/ynn' );
const app = new Ynn( {
    root : __dirname,
    debugging : true, //Ynn.DEBUGGING_WARN | Ynn.DEBUGGING_ERROR,
    logging : false
} );
require.main === module && app.listen( Ynn.cargs.port );
module.exports = app;
