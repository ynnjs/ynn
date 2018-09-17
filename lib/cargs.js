const argv = require( 'yargs' ).argv;

const cargs = {
};


/**
 * --debugging=[true|false|integer]
 *
 * To start the process in debugging mode, this option will override the settings in the Ynn app instance.
 */
if( argv.hasOwnProperty( 'debugging' ) ) {
    cargs.debugging = new Function( `return ${argv.debugging}` )();
}

/**
 * --allow-interactive
 *
 * to allow the interactive mode, the interactive mode will not be started automatically but it can be started with shortcut keys or instructions.
 */
cargs[ 'allow-interactive' ] = argv.hasOwnProperty( 'allow-interactive' );

/**
 * --interactive
 *
 *  To start the process in interactive mode directly
 */
cargs.interactive = argv.hasOwnProperty( 'interactive' );
if( cargs.interactive ) {
    cargs[ 'allow-interactive' ] = true;
}

if( argv.port ) {
    cargs.port = argv.port;
}

module.exports = cargs;
