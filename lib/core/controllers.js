const path = require( 'path' );
const utils = require( '../utils' );
const loader = require( '../loader' );

module.exports = async function() {
    const dir = path.resolve( this.root, this.config( 'app.controller.path', 'controller' ) );
    if( utils.isdir( dir ) ) {
        try {
            Object.assign( this.controllers, loader.files( dir ) );
        } catch( e ) {
            this.console.error( e );
            this.logger.error( 'Uncaught error while initializing controllers', Object.assign( this.inspect(), { error : e.message } ) );
        }
    }
}
