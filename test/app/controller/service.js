module.exports = class extends require( '../../../lib/controller' ) {

    callAction() {
        return {
            content : this.service( 'index' ).name()
        };
    }

    argumentsAction() {
        return {
            content : this.service( 'arguments', {
                text : 't'
            } ).name()
        }
    }

    configAction() {
        return {
            name : this.service( 'index' ).getAppName()
        }
    }
}
