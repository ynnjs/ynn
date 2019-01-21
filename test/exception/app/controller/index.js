module.exports = class extends require( '../../../..' ).Controller {
    indexAction() {
        throw 'exception'
    }
}
