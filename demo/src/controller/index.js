const Ynn = require( '../../../' );

module.exports = class extends Ynn.Controller {
    indexAction() {
        return { status : 'ok' };
    }
}
