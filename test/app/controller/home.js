class Home extends require( '../../../lib/controller' ) {
    indexAction() {
        return {
            status : 'OK'
        };
    }

    consoleAction() {
        this.console.log( this.ctx.query );
        return 'xxxx';
    }
}

module.exports = Home;
