const path = require( 'path' );
const utils = require( '../utils' );
const loader = require( '../loader' );

module.exports = async function() {
    const dir = path.resolve( this.root, this.config( 'app.service.path', 'service' ) );
    if( utils.isdir( dir ) ) {
        try {
            Object.assign( this.services, loader.files( dir ) ); 
        } catch( e ) {
            this.logger.error( 'Uncaught error while initializing services', Object.assign( this.inspect(), { error : e.message } ) );
            throw e;
        } 
    }
}
