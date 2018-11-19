module.exports = class extends require( '../../../..' ).Controller {
    indexAction() {
        return '/index/index';
    }

    customAction() {
        return '/index/custom';
    }
}
