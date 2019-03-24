const path = require( 'path' );
const Config = require( '@lvchengbin/config' );
const is = require( '@lvchengbin/is' );

const YNN_GLOBAL_MOUNTING_DATA = Symbol.for( 'ynn#global#mounting#data' );

const mounting = global[ YNN_GLOBAL_MOUNTING_DATA ];
/**
 * [ mounting.config, app.config, ynn.config ]
 */
module.exports = function( options ) {

    mounting.config && this.configs.push( new Config( mounting.config ) );
    options && this.configs.push( new Config( options ) );

    /**
     * to load config files from the specified config dir
     */
    if( this.configDir ) {
        const config = this.loadFiles( this.configDir );
        config && this.configs.push( new Config( config ) );
    }

    /**
     * to load the config files of the module
     */
    let config = this.loadFiles( path.join( this.root, 'config' ) );
    config && this.configs.push( new Config( config ) );

    /**
     * to load the default config files of Ynn
     */
    config = this.loadFiles( path.join( __dirname, '..', 'config' ) );
    config && this.configs.push( new Config( config ) );

    for( const config of this.configs ) {
        for( const prop in config.config ) {
            const item = config.config[ prop ];
            is.function( item ) && ( config.config[ prop ] = item( this ) );
        } 
    }
}
