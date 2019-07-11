#! /usr/bin/env node

const Ynn = require( '../../' );
const app = new Ynn( {
    root : __dirname,
    debugging : true,
    logging : false,
    modules : {
    }
} );

app.listen( );
