const Ynn = require( '../../../' );

module.exports = class extends Ynn.Controller {
    indexAction() {
        return this.rsc.call( 'https://www.baidu.com' );
    }
    errorAction() {
        return this.rsc.call( 'http://3904324324fsjlajfsljfsa' );
    }
}

