const url = require( 'url' );
const querystring = require( 'querystring' );
const Events = require( 'events' );
const request = require( 'request' );
const is = require( '@lvchengbin/is' );
const Console = require( './console' );

const YNN_PORT = Symbol.for( 'ynn#port' );
const YNN_UDS = Symbol.for( 'ynn#uds' );
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

    /**
     * to get service config till reach the top
     */
    serviceConf( service, defaultValue ) {
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
    [ GET_REQUEST_OPTIONS ]( uri, params, opt = {} ) {
        const options = {};
        const api = {};
        let config = {};

        if( uri.indexOf( '://' ) === -1 ) {
            const i = uri.indexOf( ':' );
            const service = i < 0 ? '~' : uri.substr( 0, i );
            // the path
            let pa = uri.substr( i + 1 );

            config = this.serviceConf( service );

            if( !config ) {
                const msg = `cannot find service "${service}".`;
                this.app.output.error( msg );
                throw new Error( msg );
            }

            // api
            const a = this.serviceConf( `${service}.api.${pa}` );

            if( a ) {
                if( a.path ) pa = a.path;
                Object.assign( api, a );
            }

            let local;
            if( this.app[ YNN_UDS ] ) {
                local = `unix:${this.app[YNN_UDS]}:`;
            } else {
                local = '127.0.0.1:' + this.app[ YNN_PORT ];
            }
            options.uri = url.resolve( `${config.protocol||'http'}://${config.host||local}`, pa );

        } else options.uri = uri;

        options.timeout = opt.timeout || api.timeout || config.timeout || 5000;
        options.method = ( opt.method || api.method || 'GET' ).toUpperCase();

        options.headers =  {};

        const headers = Object.assign( {}, config.headers || {}, api.headers || {}, opt.headers || {} );
        for( const name of Object.keys( headers ) ) {
            options.headers[ name.toLowerCase() ] = headers[ name ];
        }

        if( !options.headers[ 'x-forwarded-from' ] && options.ctx ) {
            options.headers[ 'x-forwarded-from' ] = options.ctx.request.ip;
        }

        // params can be set to null and to set full options for request in options
        if( params ) {

            params = Object.assign( {}, config.params || {}, api.params || {}, params );

            if( options.method === 'GET' || options.method === 'HEAD' ) {
                options.qs = Object.assign( rscqs( this ), params );
            } else {
                const ct = options[ 'content-type' ] || api[ 'content-type' ] || config[ 'content-type' ];
                if( ct === 'application/json' ) {
                    options.body = params;
                } else if( ct === 'multipart/form-data' ) {
                    options.formData = params;
                } else if( ct === 'multipart/related' ) {
                    options.multipart = params;
                } else {
                    options.form = params;
                }
                options.qs = rscqs( this );
            }
        }
        if( opt.qs ) {
            Object.assign( options.qs, opt.qs );
        }
        options.json = is.undefined( opt.json ) ? true : opt.json;
        return options;
    }

    async call( uri, params = {}, opt = {} ) {
        const logger = this.app.rscLogger;
        const options = this[ GET_REQUEST_OPTIONS ]( uri, params, opt );

        return new Promise( ( resolve, reject ) => {
            const start = new Date;
            const callback = ( err, res, body ) => {
                if( err ) {
                    const log = [
                        '[ERROR]',
                        new Date,
                        `"${options.method}: ${options.uri} ${options.protocol}"`,
                    ].join( ' ' );

                    logger.info( log );
                    this.console.error( log );
                    this.emit( 'failure', err, options );
                    return reject( res );
                }
                const str = res.body ? ( is.plainObject( res.body ) ? JSON.stringify( res.body ) : res.body ) : '-';
                const log = [
                    '[INFO]',
                    new Date,
                    `"${options.method}: ${options.uri} ${options.protocol}"`,
                    res.statusCode,
                    `"${opt.qs?querystring.stringify(opt.qs):'-'}"`,
                    `${new Date-start}ms`,
                    `"${str.substr(0,300).replace( /[\n\r]+/g, '\\n' )}" `
                ].join( ' ' );
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

    callStream( uri, params = {}, opt = {} ) {
        const options = this[ GET_REQUEST_OPTIONS ]( uri, params, opt );
        return request( options );
    }

    get( uri, qs = {}, opts = {} ) {
        return this.call( uri, qs, Object.assign( {
            method : 'GET'
        }, opts ) );
    }

    post( uri, form = {}, opts = {} ) {
        return this.call( uri, form, Object.assign( {
            method : 'POST'
        }, opts ) );
    }

    static middleware() {
        return async ( ctx, next ) => {
            if( ctx.rsc ) return next();
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
