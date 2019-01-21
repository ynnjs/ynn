const Console = require( './console' );
const Base = require( './base' );
const output = require( './output' );

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
        this.output = output( this );
    }

    config() {
        return this.app.config( ...arguments );
    }

    service() {
        return this.app.service( ...arguments );
    }
}

module.exports = Service;
