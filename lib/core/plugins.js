/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File：plugins.js
 * Author ：LvChengbin<lvchengbin59@gmail.com>
 * Time ：02/13/2020
 * Description ：
 ******************************************************************/

const path = require( 'path' );
const is = require( '@lvchengbin/is' );

module.exports = function() {
    let plugins = this.config( 'plugins', {} );

    if( is.function( plugins ) ) {
        plugins = plugins.call( this, this );
    }

    plugins = Object.assign( {}, plugins, this.plugins || {} );

    for( const name in plugins ) {
        let plugin = plugins[ name ];

        if( is.function( plugin ) && !is.class( plugin ) ) {
            this[ name ] = plugin( this, { name } );
            continue;
        }

        if( is.string( plugin ) ) {
            plugin = { path : plugin };
            plugins[ name ] = plugin;
        }

        if( !plugin.options ) {
            plugin.options = {};
        }

        if( !plugin.options.name ) {
            plugin.options.name = name;
        }

        let P;

        if( plugin.plugin ) {
            P = plugin.plugin;
        } else {
            const c = plugin.path.charAt( 0 );

            if( c === '.' || c === '/' ) {
                plugin.path = path.resolve( this.root, plugin.path );
            }
        }

        try {

            if( !P && plugin.path ) {
                P = require( plugin.path );
            }

            if( is.class( P ) ) {
                plugin.instance = new P( this, plugin.options );
            } else if( is.function( P ) ) {
                plugin.instance = P( this, plugin.options );
            } else {
                this[ name ] = P;
            }
        } catch( e ) {
            this.output.error( `Failed to load plugin "${name}".`, {
                plugin,
                error : e.message
            } );
            throw e;
        }
    }

    this.plugins = plugins;
    const promises = [];
    for( const name in plugins ) {
        const item = plugins[ name ].instance;
        if( is.promise( item ) ) {
            promises.push( item );
        } else if( item && is.function( item.ready ) ) {
            promises.push( item.ready() );
        }
    }
    return Promise.all( promises );
}
