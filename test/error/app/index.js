#!/usr/bin/env node

const Ynn = require( 'ynn' );
const app = new Ynn( {
    root : __dirname,
    debugging : false
} );
require.main === module && app.listen( Ynn.cargs.port );
module.exports = app;
