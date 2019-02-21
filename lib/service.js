const Koa = require( 'koa' );
const Console = require( './console' );
const Runtime = require( './runtime' );

class Service extends Runtime {
    constructor( ctx, options = {} ) {

        if( ctx instanceof Koa ) {
            super( null, options );
            this.ctx = null;
            this.app = ctx;
            this.rsc = ctx.rsc;
            this.logger = ctx.logger;
        } else {
            super( ctx, options );
        }

        this.console = new Console( this, 'service' );
    }
}

module.exports = Service;
