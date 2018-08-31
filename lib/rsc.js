const url = require( 'url' );
const Events = require( 'events' );
const request = require( 'request-promise-native' );
const Config = require( '@lvchengbin/config' );
const is = require( '@lvchengbin/is' );
const Console = require( './console' );

const YNN_PORT = Symbol.for( 'ynn#port' );
const RSC_APP_CONFIG_INSTANCE = Symbol( 'rsc#app#config#instance' );
const RSC_CONFIG = Symbol( 'rsc#config' );

const QUERY_PERFIX = '$ynn_rsc__';

class RSC extends Events {
    constructor( app, options = {} ) {
        super();

        if( is.undefined( options.debugging ) ) {
            options.debugging = app.debugging;
        }

        Object.assign( this, options );
        this.app = app;

        this.console = new Console( this, 'rsc' );

        let m = app;
        const config = {
            client : {},
            service : {}
        };

        while( m ) {
            for( let i = m.configs.length - 1; i >= 0; i -= 1 ) {
                const item = m.configs[ i ];
                const cc = item.get( 'rsc.client' );
                if( !is.undefined( cc ) ) {
                    Object.assign( config.client, cc );
                }
                const cs = item.get( 'rsc.service' );
                if( !is.undefined( cs ) ) {
                    Object.assign( config.service, cs );
                }
            }
            m.configs
            m = m.parent;
        }

        this[ RSC_APP_CONFIG_INSTANCE ] = new Config( config );
    }

    /**
     * @todo to look up the configuration in the tree
     */
    [RSC_CONFIG]( path, defaultValue ) {
        return this[ RSC_APP_CONFIG_INSTANCE ].get( path, defaultValue );
    }

    async call( service, path, opt = {} ) {
        if( !is.string( service ) ) {
            opt = service;
            if( !opt.uri ) {
                throw new Error( 'invalid params' );
            }
        }

        let uri = opt.uri;
        let timeout = 5000;

        if( !uri ) {
            const conf = this[ RSC_CONFIG ]( `service.${service}` );

            if( !conf ) {
                const msg = `cannot find service "${service}" in config files.`;
                this.app.logger.error( msg, this.app.inspect() );
                throw new Error( msg );
            }
            const host = conf.host === '~' ? `127.0.0.1:${this.app[YNN_PORT]}` : conf.host;
            uri = url.resolve( `${conf.protocol}://${host}`, path );
            timeout = conf.timeout;
        }

        const method = opt.method || 'GET';

        const options = {
            uri,
            method,
            timeout,
            json : true
        }

        if( options.method.toUpperCase() === 'POST' ) {
            options.qs = rscqs( this );
            options.body = opt.body || {};
        } else {
            options.qs = Object.assign( rscqs( this ), opt.qs );
        }

        const res = await request( options ).catch( e => {
            this.app.logger.error( `failed to call remote service: ${e.message}`, Object.assign( this.app.inspect, { options } ) );
            this.emit( 'failure', e, options );
            if( is.function( this.onfailure ) ) {
                return this.onfailure( e, options );
            }
            throw e;
        } );

        this.emit( 'success', res, options );

        if( is.function( this.onsuccess ) ) {
            return this.onsuccess( res, options );
        }
        return res;
    }

    get( service, path, qs = {} ) {
        return this.call( service, path, {
            method : 'GET',
            qs
        } );
    }

    post( service, path, body = {} ) {
        return this.call( service, path, {
            method : 'POST',
            body
        } );
    }

    async api( service, api, params = {} ) {
        const conf = this[ RSC_CONFIG ]( `service.${service}` );

        if( !conf ) {
            const msg = `cannot find service "${service}" in config files.`;
            this.logger.error( msg );    
            throw new Error( msg );
        }

        const apis = conf.api;
        const apiConf = apis[ api ];

        if( !apis || !apiConf ) {
            const msg = `cannot find API ${api} in ${service} service.`;
            this.logger.error( msg );
            throw new Error( msg );
        }

        const host = conf.host === '~' ? `127.0.0.1:${this.app[YNN_PORT]}` : conf.host;
        let uri = `${conf.protocol}://${host}/${api}`;

        const method = apiConf.method || 'GET';

        const options = {
            uri,
            method,
            timeout : apiConf.timeout || 5000,
            json : true
        }

        if( method.toUpperCase() === 'POST' ) {
            options.qs = rscqs( this );
            options.body = params;
        } else {
            options.qs = Object.assign( rscqs( this ),  params );
        }

        const res = await request( options ).catch( e => {
            this.app.logger.error( `failed to call remove service: ${e.message}`, Object.assign( this.app.inspect(), { options } ) );
            this.emit( 'failure', e, options );

            if( is.function( this.onfailure ) ) {
                return this.onfailure( e, options );
            }
            throw e;
        } );

        this.emit( 'success', res, options );

        if( is.function( this.onsuccess ) ) {
            return this.onsuccess( res );
        }
        return res;
    }

    static middleware() {
        return async ( ctx, next ) => {
            const query = ctx.query;
            if( query[ `${QUERY_PERFIX}rsc` ] != 1 ) return next();
            ctx.rsc = {};
            for( let key of Object.keys( query ) ) {
                if( key.indexOf( QUERY_PERFIX ) ) continue;
                ctx.rsc[ key.substr( QUERY_PERFIX.length ) ] = query[ key ];
            }
            return next();
        };
    }
}

RSC.QUERY_PERFIX = QUERY_PERFIX;

function rscqs( rsc ) {
    return {
        [ `${RSC.QUERY_PERFIX}key` ] : rsc[ RSC_CONFIG ]( 'client.key', '' ),
        [ `${RSC.QUERY_PERFIX}client` ] : rsc[ RSC_CONFIG ]( 'client.name', '' ),
        [ `${RSC.QUERY_PERFIX}token` ] : rsc[ RSC_CONFIG ]( 'client.token', '' ),
        [ `${RSC.QUERY_PERFIX}rsc` ] : 1,
        [ `${RSC.QUERY_PERFIX}time` ] : +new Date
    };
}

module.exports = RSC;
