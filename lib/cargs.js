const path = require( 'path' );
const is = require( '@lvchengbin/is' );
const argv = require( 'yargs' ).argv;

const cwd = process.cwd();

const cargs = {};

function cop( arg, cb ) {
    if( argv.hasOwnProperty( arg ) ) {
        if( is.function( cb ) ) {
            const res = cb( argv[ arg ] );
            if( !is.undefined( res ) ) cargs[ arg ] = res;
        } else {
            return cargs[ arg ] = argv[ arg ];
        }
    } else if( !is.undefined( cb ) && !is.function( cb ) ) {
        return cargs[ arg ] = cb;
    }
}

/**
 * --debugging=[true|false], -D
 *
 * To start the process in debugging mode, this option will override the settings in the Ynn app instance.
 */
cop( 'debugging', x => new Function( `return ${x}` )() );

/**
 * --logging=[true|false]
 *
 * To enable/disable log and access log.
 */
cop( 'logging', x => new Function( `return ${x}` )() );

/**
 * --root=[path]
 *
 * The root path of the application
 */
cop( 'root', x => path.resolve( cwd, x ) );

/**
 * --allow-interactive
 *
 * to allow the interactive mode, the interactive mode will not be started automatically but it can be started with shortcut keys or instructions.
 */
cop( 'allow-interactive', x => new Function( `return ${x}` )() );

/**
 * --interactive, -I
 *
 *  To start the process in interactive mode directly
 */
cop( 'interactive', () => {
    cargs.interactive = true;
    cargs[ 'allow-interactive' ] = true;
} );

cop( 'port' );

module.exports = cargs;
