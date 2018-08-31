const is = require( '@lvchengbin/is' );
const Console = require( './console' );
const Runtime = require( './runtime' );

module.exports = class extends Runtime {
    constructor( ctx, options = {} ) {
        if( is.undefined( options.debugging ) ) {
            options.debugging = ctx.app.debugging;
        }
        super( ctx, options );
        this.console = new Console( this, 'boot' );
    }
}
