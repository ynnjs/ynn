const fs = require( 'fs' );
const path = require( 'path' );
const is = require( '@lvchengbin/is' );
const utils = require( './utils' );

module.exports.files = ( dir, filter ) => {

    if( !utils.isdir( dir ) ) {
        throw new Error( `"${dir}" is not a dir` );
    }

    const res = {};

    const list = fs.readdirSync( dir );

    for( const name of list ) {

        // skip ., .. and hidden files
        if( name.charAt( 0 ) === '.' ) continue;

        // skip files start with underscore
        if( name.charAt( 0 ) === '_' ) continue;

        const ext = path.extname( name );

        // skip files which are not .js file or .json file
        if( [ '.js', '.json' ].indexOf( ext ) < 0 )  continue;

        const fp = path.join( dir, name );

        // skip sub directories
        if( utils.isdir( fp ) ) continue;

        const base = path.basename( name, ext );

        if( is.function( filter ) && filter( fp, name, base, ext ) === false ) continue;

        res[ base ] = require( fp );
    }
    return res;
};
