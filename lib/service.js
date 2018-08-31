const Console = require( './console' );
const Base = require( './base' );

class Service extends Base {
    constructor( ctx, options = {} ) {
        super();

        if( !options.hasOwnProperty( 'debugging' ) ) {
            options.debugging = ctx.app.debugging;
        }

        Object.assign( this, options );

        this.ctx = ctx;
        this.app = ctx.app;
        this.rsc = this.app.rsc;
        this.logger = this.app.logger;
        this.console = new Console( this, 'service' );
    }

    config() {
        return this.app.config( ...arguments );
    }

    service() {
        return this.app.service( ...arguments );
    }
}

module.exports = Service;
