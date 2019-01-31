const RSC = require( '../rsc' );

module.exports = async function() {
    try {
        this.rsc = new RSC( this );    
    } catch( e ) {
        this.console.error( e );
        this.logger.error( 'Uncaught error while initializing RSC', Object.assign( this.inspect(), { error : e.message } ) );
    }
}
