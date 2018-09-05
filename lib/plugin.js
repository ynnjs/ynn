const is = require( '@lvchengbin/is' );
const Base = require( './base' );
const Console = require( './console' );

module.exports = class Plugin extends Base {
    constructor( app, options = {} ) {
        if( is.undefined( options.debugging ) ) {
            options.debugging = app.debugging;
        }
        super();
        this.app = app;
        this.console = new Console( this, 'plugin' );
    }
}
