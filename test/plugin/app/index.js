#!/usr/bin/env node

const Ynn = require( '../../../lib/ynn' );
const app = new Ynn( { root : __dirname } );
require.main === module && app.listen( Ynn.cargs.port );
module.exports = app;
