module.exports = class index extends require( '../../../../lib/controller' ) {
    indexAction() {
        const ctx = this.ctx;
        const method = ctx.method;
        const res = {
            status : 'RSC',
            method,
            'rsc-header' : ctx.headers[ 'x-rsc-service' ]
        };

        if( method === 'POST' ) {
            res.token = ctx.request.body.token;
        } else {
            res.token = ctx.query.token;
        }
        return res;
    }

    postAction() {
        const ctx = this.ctx;
        return {
            method : ctx.method,
            token : ctx.request.body.token,
            headers : {
                api : ctx.headers[ 'x-rsc-service-api' ]
            }
        }
    }

    getAction() {
        const ctx = this.ctx;
        return {
            method : ctx.method,
            token : ctx.query.token,
            headers : {
                api : ctx.headers[ 'x-rsc-service-api' ]
            }
        }
    }
}
