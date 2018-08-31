const Controller = require( '../../../lib/controller' );

module.exports = class extends Controller {
    indexAction() {
        return {
            boot : this.ctx._boot
        }
    }
}
