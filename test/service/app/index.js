#!/usr/bin/env node

const Ynn = require( '../../../lib/ynn' );
const C = require( '../../../lib/constants' );
const app = new Ynn( { 
    root : __dirname,
    debugging : C.DEBUGGING_WARN | C.DEBUGGING_ERROR,
    logging : false
} );
require.main === module && app.listen( Ynn.cargs.port );
module.exports = app;
