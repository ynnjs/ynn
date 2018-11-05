const fs = require( 'fs' );
const path = require( 'path' );
const is = require( '@lvchengbin/is' );

module.exports.require = ( ...args ) => {
    return require( path.resolve( ...args ) );
};

module.exports.call = ( fn, thisArg, ...args ) => {
    if( is.class( fn ) ) {
        return new ( Function.prototype.bind.call( fn, null, ...args ) );
    }
    
    if( is.function( fn ) ) {
        return fn.call( thisArg, ...args );
    }

    return fn;
};

module.exports.isdir = ( ...args ) => {
    const file = path.resolve( ...args );
    try {
        const lstat = fs.lstatSync( file );
        return lstat.isDirectory();
    } catch( e ) {
        return false;
    }
};

const readCache = {};

module.exports.read = ( path, options = {} ) => {
    const str = readCache[ path ];
    if( str && options.cache ) return Promise.resolve( str );

    return new Promise( ( resolve, reject ) => {
        fs.readFile( path, options.encoding || 'utf8', ( err, str ) => {
            if( err ) return reject( err );
            str = str.replace( /^\uFEFF/, '' ); 
            if( options.cache ) readCache[ path ] = str;
            resolve( str );
        } );
    } );
};

module.exports.parsePath = ( template, params, matches, parse = [ 'module', 'controller', 'action' ] ) => {
    const output = template.replace( /\$([a-zA-Z0-9_-]+)/g, ( m, n ) => {
        if( /^\d+$/.test( n ) ) {
            return matches[ n ] || n;
        }
        return params[ n ] || n;
    } );
    if( !parse ) return output

    const pieces = output.split( '.' );
    const res = {};

    for( const item of parse.reverse() ) {
        if( pieces.length ) {
            res[ item ] = pieces.pop();
        }
    }
    return res;
};
