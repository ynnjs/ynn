const fs = require( 'fs' );
const path = require( 'path' );
const is = require( '@lvchengbin/is' );
const C = require( '../constants' );
const utils = require( '../utils' );

const YNN_GLOBAL_MOUNTING_DATA = Symbol.for( 'ynn#global#mounting#data' );

const mounting = global[ YNN_GLOBAL_MOUNTING_DATA ];

module.exports = async function() {
    let modules = this.config( 'modules', {} );

    if( is.function( modules ) ) {
        modules = modules.call( this, this );
    }

    modules = Object.assign( {}, modules, this.modules || {} );

    for( const name in modules ) {
        let module = modules[ name ];

        if( is.string( module ) ) {
            module = { path : module };
            modules[ name ] = module;
        }

        if( !module[ 'log-path' ] ) {
            module[ 'log-path' ] = path.join( this[ 'log-path' ], name );
        }

        const c = module.path.charAt( 0 );

        const mountingData = {
            name,
            parent : this,
            config : module.config,
            configDir : module.configDir,
            'log-path' : module[ 'log-path' ]
        };

        if( this.logging === false || this.logging === C.LOGGING_DISABLE_ALL ) {
            mountingData.logging = C.LOGGING_DISABLE_ALL;
        }

        // to load module from node_modules
        if( c !== '/' && c !== '.' ) {
            try {
                mounting.set( Object.assign( {
                    path : require.resolve( module.path ),
                }, mountingData ) );
                module.instance = require( module.path );
            } catch( e ) {
                const msg = `Failed to load module "${name}" from "${module.path}".`;
                this.logger.error( msg, {
                    error : e.message,
                    module
                } );
                throw e;
            }
        } else {
            let file = path.resolve( this.root, module.path );

            if( !fs.existsSync( file ) ) {
                const msg = `module ${file} not exists.`;
                this.logger.error( msg, {
                    module,
                    path : file
                } );
                throw new Error( msg );
            }

            // to concat 'index.js' to the module path for preventing that in some cases there is a js file has same file name with the module.
            if( utils.isdir( file ) ) {
                file = path.join( file, 'index.js' );
            }

            try {
                mounting.set( Object.assign( {
                    path : require.resolve( file ),
                }, mountingData ) );
                module.instance = require( file );
            } catch( e ) {
                this.logger.error( `Failed to load module "${module}" from "${file}".`, {
                    error : e.message,
                    path : file,
                    module
                } );
                throw e;
            }
        }
        mounting.reset();
    }
    this.modules = modules;
    const promises = [];
    for( const name in modules ) {
        const ins = modules[ name ].instance;
        if( is.promise( ins ) ) {
            promises.push( ins );
        } else if( is.function( ins.ready ) ) {
            promises.push( ins.ready() );
        }
    }

    return Promise.all( promises );
}
