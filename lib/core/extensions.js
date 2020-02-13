/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File：extensions.js
 * Author ：LvChengbin<lvchengbin59@gmail.com>
 * Time ：02/13/2020
 * Description ：
 ******************************************************************/

const path = require( 'path' );
const is = require( '@lvchengbin/is' );

module.exports = function() {
    let extensions = this.config( 'extensions', {} );

    if( is.function( extensions ) ) {
        extensions = extensions.call( this, this );
    }

    extensions = Object.assign( {}, extensions, this.extensions || {} );

    for( const name in extensions ) {
        let extension = extensions[ name ];

        if( is.class( extension ) ) {
            this[ name ] = extension;
            continue;
        }

        /**
         * if the extension is a function, just bind the function to the instance
         */
        if( is.function( extension ) && !is.class( extension ) ) {
            this[ name ] = extension( this, { name } );
            continue;
        }

        /**
         * if the extension is a path, use it as a path property
         */
        if( is.string( extension ) ) {
            extension = { path : extension }
        }

        if( !extension.options ) {
            extension.options = {};
        }

        if( !extension.options.name ) {
            extension.options.name = name;
        }

        const c = extension.path[ 0 ];

        if( c === '.' || c === '/' ) {
            extension.path = path.resolve( this.root, extension.path );
        }

        try {
            let E = require( extension.path );
            if( is.function( E ) && !is.class( E ) ) {
                extension.instance = E( this, extension.options );
            } else {
                this[ name ] = E;
            }
        } catch( e ) {
            this.output.error( `Failed to load extension "${name}".`, {
                extension,
                error : e.message
            } );
            throw e;
        }
    }

    return this.extensions = extensions;
}
