const Console = require( './console' );
const Base = require( './base' );

class Service extends Base {
    constructor( app, options = {} ) {
        super();

        if( !options.hasOwnProperty( 'debugging' ) ) {
            options.debugging = app.debugging;
        }

        Object.assign( this, options );

        this.app = app;
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
