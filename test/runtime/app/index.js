#!/usr/bin/env node

const Ynn = require( '../../..' );
const app = new Ynn( { 
    root : __dirname,
    debugging : true,//Ynn.DEBUGGING_DANGER, 
    logging : false,
    routers() {
        this.router.add( '/', ( ctx, next, rt ) => {
            rt.assert( ctx.query.id )
                .is( 'int', 400, 'id should be an integer' )
                .value();
        } );
    }
} );
require.main === module && app.listen( Ynn.cargs.port );
module.exports = app;
