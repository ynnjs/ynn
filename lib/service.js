const Console = require( './console' );
const Runtime = require( './runtime' );

class Service extends Runtime {
    constructor( ctx, options = {} ) {
        super( ctx, options );
        this.console = new Console( this, 'service' );
    }
}

module.exports = Service;
