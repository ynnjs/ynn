module.exports = class extends require( 'ynn' ).Controller {
    indexAction() {
        return '/index/index';
    }

    customAction() {
        return '/index/custom';
    }
}
