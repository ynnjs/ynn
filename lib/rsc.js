/******************************************************************
 * Copyright (C) 2019 LvChengbin
 * 
 * File：rsc.js
 * Author ：LvChengbin<lvchengbin59@gmail.com>
 * Time ：07/09/2019
 * Description ：Remote Service Call
 ******************************************************************/

const url = require( 'url' );
const querystring = require( 'querystring' );
const Events = require( 'events' );
const request = require( 'request' );
const typeis = require( 'type-is' );
const is = require( '@lvchengbin/is' );
const Console = require( './console' );
const output = require( './output' );

const YNN_PORT = Symbol.for( 'ynn#port' );
const YNN_UDS = Symbol.for( 'ynn#uds' );
const GET_REQUEST_OPTIONS = Symbol( 'get#request#options' );
const REQUEST = Symbol( 'request' );

const QUERY_PERFIX = '$ynn_rsc__';

class RSC extends Events {
    constructor( app, options = {} ) {
        super();

        if( is.undefined( options.debugging ) ) {
            options.debugging = app.debugging;
        }

        this.app = app;
        this.console = new Console( this, 'rsc' );
        this.logger = app.rscLogger;

        Object.assign( this, options );
        this.output = output( this );
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
    [ GET_REQUEST_OPTIONS ]( uri, params, opt = {}, rawurl ) {
        const options = {};
        const api = {};
        let config = {};

        if( rawurl ) { options.uri = uri } else {

            const i = uri.indexOf( ':' );
            const group = uri.substr( 0, i );
            let pa = uri.substr( i + 1 );

            config = this.serviceConf( group );

            if( !config ) {
                throw new Error( `cannot find service group "${group}" in RSC config.` );
            }

            const a = this.serviceConf( `${group}.api.${pa}` );

            if( a ) {
                a.path && ( pa = a.path );
                Object.assign( api, a );
            }

            if( config.host ) {
                options.uri = url.resolve( `${config.protocol||'http'}://${config.host}`, pa );
            } else {
                const local = this.app[ YNN_UDS ] ? `unix:${this.app[YNN_UDS]}` : `127.0.0.1:${this.app[YNN_PORT]}`;
                options.uri = url.resolve( `${config.protocol||'http'}://${local}`, pa );
            }
        }

        options.timeout = opt.timeout || api.timeout || config.timeout || 5000;
        options.method = ( opt.method || api.method || 'GET' ).toUpperCase();

        options.headers =  {};

        const headers = Object.assign( {}, config.headers || {}, api.headers || {}, opt.headers || {} );
        for( const name of Object.keys( headers ) ) {
            options.headers[ name.toLowerCase() ] = headers[ name ];
        }

        // params can be set to null and to set full options for request in options
        if( params ) {

            params = Object.assign( {}, config.params || {}, api.params || {}, params );

            if( options.method === 'GET' || options.method === 'HEAD' ) {
                options.qs = Object.assign( rscqs( this ), params );
            } else {
                const ct = options.headers[ 'content-type' ];

                if( typeis.is( ct, 'application/json' ) ) {
                    options.body = params;
                } else if( typeis.is( ct, 'multipart/form-data' ) ) {
                    options.formData = params;
                } else if( typeis.is( ct, 'multipart/related' ) ) {
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

    async request( uri, params = {}, opt = {} ) {
        return this[ REQUEST ]( uri, params, opt, true );
    }

    async call( uri, params = {}, opt = {} ) {
        return this[ REQUEST ]( uri, params, opt );
    }

    [ REQUEST ]() {
        let options;
        try {
            options = this[ GET_REQUEST_OPTIONS ]( ...arguments );
        } catch( e ) {
            this.output.error( e.message );
            return;
        }
        return new Promise( ( resolve, reject ) => {
            const start = new Date;
            const callback = ( err, res, body ) => {
                const slices = [
                    `${new Date} "${options.method}: ${options.uri}" ${res?res.statusCode:'-'}`,
                    `"${options.qs?querystring.stringify(options.qs):'-'}"`,
                    `${new Date-start}ms`,
                ];
                if( err ) {
                    this.output.info( `[ERROR] ${slices.join( ' ' )}` );
                    this.emit( 'failure', err, options );
                    return reject( res );
                }
                const str = res.body ? ( is.plainObject( res.body ) ? JSON.stringify( res.body ) : res.body ) : '-';
                slices.push( `"${str.substr(0,300).replace( /[\n\r]+/g, '\\n' )}"`);
                this.output.info( `[INFO] ${slices.join(' ')}` );
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
        this.output.info( [
            '[INFO]',
            `${new Date} "${options.method}: ${options.uri}" STREAM`,
            `"${options.qs?querystring.stringify(options.qs):'-'}"`,
        ].join( ' ' ) );
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
