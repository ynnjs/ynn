const Console = require( './console' );
const Runtime = require( './runtime' );

class Middleware extends Runtime {
    constructor( ctx, next, options = {} ) {
        super( ctx, options );
        this.next = next;
        this.rsc = this.app.rsc;
        this.console = new Console( this, 'middleware' );
    }
}

module.exports = Middleware;
