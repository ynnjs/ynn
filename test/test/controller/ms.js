module.exports = class extends require( '../../../lib/controller' ) {
    indexAction() {
        const ctx = this.ctx;
        const method = ctx.method;
        const res = {
            status : 'RSC',
            method
        };

        if( method === 'POST' ) {
            res.token = ctx.request.body.token;
        } else {
            res.token = ctx.query.token;
        }
        return res;
    }
}
