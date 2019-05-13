#! /usr/bin/env node

const Ynn = require( '../../' );
const app = new Ynn( {
    root : __dirname,
    debugging : true,
    logging : false,
    modules : {
        id : 'ynn-ms-idalloc'
    }
} );

app.listen( 3000 );
