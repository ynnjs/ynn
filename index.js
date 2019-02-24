const YNN_GLOBAL_MOUNTING_DATA = Symbol.for( 'ynn#global#mounting#data' );
global[ YNN_GLOBAL_MOUNTING_DATA ] = {
    status : 0,
    set( obj ) {
        Object.assign( this, obj );
        this.status = 1;
    },
    reset() {
        this.status = 0;
    }
};

module.exports = require( './lib/core' );
module.exports.Base = require( './lib/base' );
module.exports.Runtime = require( './lib/runtime' );
module.exports.Controller = require( './lib/controller' );
module.exports.Service = require( './lib/service' );
module.exports.RSC = require( './lib/rsc' );
module.exports.Plugin = require( './lib/plugin' );
module.exports.Console = require( './lib/console' );
module.exports.Router = require( './lib/router' );
module.exports.Middleware = require( './lib/middleware' );
