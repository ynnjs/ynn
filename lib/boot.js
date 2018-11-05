const is = require( '@lvchengbin/is' );
const Console = require( './console' );
const Runtime = require( './runtime' );

const BOOT_RESPONDED = Symbol.for( 'boot#responded' );

module.exports = class extends Runtime {
    constructor( ctx, options = {} ) {
        if( is.undefined( options.debugging ) ) {
            options.debugging = ctx.app.debugging;
        }
        super( ctx, options );
        this.console = new Console( this, 'boot' );

        this[ BOOT_RESPONDED ] = false;
    }

    response( ...args ) {
        this[ BOOT_RESPONDED ] = true;
        return super.response( ...args );
    }
}
