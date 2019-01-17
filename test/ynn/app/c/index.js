/**
 * @class index
 *
 * The Ynn.Controller class extends from Ynn.Runtime
 */
module.exports = class index extends require( '../../../..' ).Controller {
    /**
     * @constructs
     */
    //constructor( ctx, options = {} ) {
        //super( ctx, options );
    //}
    
    indexAction() {
        return 'Hello Ynn!'
    }

    cAction() {
        this.console.error( 'xxxxxxx' );
        return 'Hello Ynn!';
    }
    
}
