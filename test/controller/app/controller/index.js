const sleep = require( '@lvchengbin/sleep' );

module.exports = class index extends require( '../../../../lib/controller' ) {

    _initTest() {
        return sleep( 300 );
    }

    indexAction() {
        return {
            ready : this.isReady
        };
    }

    rawAction() {
        this.ctx.body = 'Hello Ynn!';
    }
}
