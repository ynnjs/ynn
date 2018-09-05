class Id extends require( '../../../lib/controller' ) {

    indexAction() {
        return {
            status : 'ID'
        };
    }

    consoleAction() {
        this.console.warn( this.ctx.query );
        return 'test console';
    }
}

module.exports = Id;
