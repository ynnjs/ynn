const REDIS = Symbol( 'redis' );

module.exports = function redis( app, options = {} ) {

    Object.defineProperty( app, options.name || 'redis', {
        get () {
            if( app[ REDIS ] ) return app[ REDIS ];
            app[ REDIS ] = 'redis';
            return app[ REDIS ];
        },

        set ( r ) {
            app[ REDIS ] = r;
        }
    } );
}
