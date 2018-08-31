const Console = require( './console' );
const Runtime = require( './runtime' );

class Controller extends Runtime {
    constructor( ctx, options = {} ) {
        super( ctx, options );
        this.rsc = this.app.rsc;

        this.console = new Console( this, 'controller' );
    }
}

module.exports = Controller;
