const Redis = require( 'ioredis' );

const REDIS = Symbol( 'redis' );

module.exports = ( app, options = {} ) => {
    const config = options.redis || app.config( 'redis' );

    Object.defineProperty( app, options.name || 'redis', {
        get redis() {
            if( app[ REDIS ] ) return app[ REDIS ];
            if( config.cluster === true ) {
                app[ REDIS ] = new Redis.Cluster( config.nodes, config );
            } else {
                app[ REDIS ] = new Redis( config );
            }
            app[ REDIS ].on( 'error', e => {
                app.logger.error( e );
                throw e;
            } );

            app[ REDIS ].on( 'connect', () => {
                app.logger.info( '[plugin redis] connect' );
            } );
            return app[ REDIS ];
        },

        set redis( r ) {
            app[ REDIS ] = r;
        }
    } );
};
