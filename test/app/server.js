const argv = require( 'yargs' ).argv;
const app = require( './index' );
app.listen( argv.port || null );
