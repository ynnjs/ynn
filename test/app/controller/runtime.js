const path = require( 'path' );

module.exports = class extends require( '../../../lib/controller' ) {
    indexAction() {
        return { status : 'OK' };
    }
    jsonpAction() {
        return this.response( {
            status : 'OK'
        }, 'jsonp' )
    }
    attachmentAction() {
        return this.attachment( path.join( __dirname, 'a.txt' ) );
    }
}
