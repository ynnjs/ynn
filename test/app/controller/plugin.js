module.exports = class extends require( '../../../lib/controller' ) {
    indexAction() {
        return this.app.testPlugin;
    }
}
