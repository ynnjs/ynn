class Home extends require( '../../../lib/controller' ) {
    indexAction() {
        return {
            status : 'OK'
        };
    }
}

module.exports = Home;
