const url = require( 'url' );
const querystring = require( 'querystring' );
const Events = require( 'events' );
const request = require( 'request' );
const is = require( '@lvchengbin/is' );
const Console = require( './console' );

const YNN_PORT = Symbol.for( 'ynn#port' );
const GET_REQUEST_OPTIONS = Symbol( 'get#request#options' );

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
    }

    client() {
        return '';
    }

    service( service, defaultValue ) {
        let m = this.app;
        while( m ) {
            const c = m.config( `rsc.service.${service}` );
            if( !is.undefined( c ) ) return c;
            m = m.parent;
        }
        return defaultValue;
    }

    /**
     * 1. parse the URI
     * 2. detect the method
     * 3. add the params to options
     */
    [ GET_REQUEST_OPTIONS ]( uri, params = {}, opt = {} ) {
        const options = {};
        const api = {};
        let config = {};

        if( uri.indexOf( '://' ) === -1 ) {
            const i = uri.indexOf( ':' );
            const service = i < 0 ? '~' : uri.substr( 0, i );
            let pa = uri.substr( i + 1 );

            config = this.service( service );

            if( !config && service === '~' ) {
                config = this.app.config( 'rsc-local.service.~' );
            }

            if( !config ) {
                const msg = `cannot find service "${service}".`;
                this.app.logger.error( msg );
                throw new Error( msg );
            }

            const a = this.service( `${service}.api.${pa}` );

            if( a ) {
                if( a.path ) pa = a.path;
                Object.assign( api, a );
            }

            const local = '127.0.0.1:' + this.app[ YNN_PORT ];
            options.uri = url.resolve( `${config.protocol||'http'}://${config.host||local}`, pa );

        } else options.uri = uri;

        options.timeout = opt.timeout || api.timeout || 5000;
        options.method = ( opt.method || api.method || 'GET' ).toUpperCase();

        if( options.method === 'GET' ) {
            options.qs = Object.assign( rscqs( this ), params );
        } else {
            options.body = params;
            options.qs = rscqs( this );
        }

        options.json = is.undefined( opt.json ) ? true : opt.json;

        options.headers =  {};

        const headers = Object.assign( {}, api.headers || config.headers || {}, opt.headers || {} );
        for( const name of Object.keys( headers ) ) {
            options.headers[ name.toLowerCase() ] = headers[ name ];
        }

        if( !options.headers[ 'x-forwarded-from' ] && options.ctx ) {
            options.headers[ 'x-forwarded-from' ] = options.ctx.request.ip;
        }

        return options;
    }

    async call( uri, params = {}, opt = {} ) {
        const logger = this.app.logger;
        const options = this[ GET_REQUEST_OPTIONS ]( uri, params, opt );

        return new Promise( ( resolve, reject ) => {
            const start = new Date;
            const callback = ( err, res, body ) => {
                if( err ) {
                    logger.error( `failed to call remote service: ${err.message}`, Object.assign( this.app.inspect, { options } ) );
                    this.emit( 'failure', err, options );
                    throw( err );
                }
                const str = res.body ? ( is.plainObject( res.body ) ? JSON.stringify( res.body ) : res.body ) : '-';
                const log = `[${new Date}] "RSC ${options.method}: ${options.uri}" "${opt.qs?querystring.stringify(opt.qs):'-'}" ${new Date-start}ms ${res.statusCode} "${str}" `;
                logger.info( log );
                this.console.info( log );
                if( res.statusCode !== 200 ) {
                    this.emit( 'failure', res, options );
                    return reject( res );
                }
                resolve( body );
                this.emit( 'success', body, options );
            } ;

            request( options, callback );
        } );
    }

    get( uri, qs = {} ) {
        return this.call( uri, qs, {
            method : 'GET'
        } );
    }

    post( uri, body = {} ) {
        return this.call( uri, body, {
            method : 'POST'
        } );
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
        [ `${RSC.QUERY_PERFIX}key` ] : rsc.client( 'client.key', '' ),
        [ `${RSC.QUERY_PERFIX}client` ] : rsc.client( 'client.name', '' ),
        [ `${RSC.QUERY_PERFIX}token` ] : rsc.client( 'client.token', '' ),
        [ `${RSC.QUERY_PERFIX}rsc` ] : 1,
        [ `${RSC.QUERY_PERFIX}time` ] : +new Date
    };
}

module.exports = RSC;
