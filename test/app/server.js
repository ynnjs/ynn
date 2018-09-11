const argv = require( 'yargs' ).argv;
const app = require( './index' );
app.listen( argv.port || null );
//app.listen( 50010 );
//app.listen( 50011 );
