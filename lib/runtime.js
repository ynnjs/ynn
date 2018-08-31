const fs = require( 'fs' );
const path = require( 'path' );
const nunjucks = require( 'nunjucks' );
const is = require( '@lvchengbin/is' );
const Base = require( './base' );
const utils = require( './utils' );

nunjucks.configure( { autoescape : true } );

class Runtime extends Base {
    constructor( ctx, options = {} ) {
        super();

        if( !options.hasOwnProperty( 'debugging' ) ) {
            options.debugging = ctx.app.debugging;
        }

        this.ctx = ctx;
        this.app = ctx.app;
        this.rsc = this.app.rsc;
        this.logger = this.app.logger;

        Object.assign( this, options );

    }

    /**
     * to throw an error
     * this method will call the ctx.throw method of koajs directly
     * @see https://koajs.com/
     */
    throw( ...args ) {
        return this.ctx.throw( ...args );
    }

    /**
     * bind response data to ctx
     *
     * @param {*} data
     * @param {string} [type] - response type
     */
    response( data, type, cb = null ) {
        const ctx = this.ctx;

        /**
         * if the response type is not specified in argument, to get the responseType from querystring
         */
        type || ( type = ctx.query.responseType );

        switch( type ) {
            case 'jsonp' : {
                const callback = cb || ctx.query.callback || 'callback';     
                ctx.set( 'Content-Type', 'application/javascript' );
                ctx.body = `${callback}(${JSON.stringify(data)})`;
                break;
            }
            case 'text' :
                ctx.set( 'Content-Type', 'plain/text' );
                ctx.body = data;
                break;
            default :
                ctx.body = data;
        }
    }

    config( ...args ) {
        return this.app.config( ...args );
    }

    /**
     * response an attachment
     *
     * @param {string} name - name of attachment.
     * @param {string} [file] - the filename on server, if this argument is omitted, the first argument will be regard as the filename
     */
    attachment( name, file ) {
        const ctx = this.ctx;

        if( arguments.length === 1 ) {
            file = name;
            name = path.basename( name );
        }

        ctx.attachment( name );
        ctx.set( 'Content-Type', 'application/octet-stream' );

        if( is.string( file ) ) {
            return fs.createReadStream( file );
        }
        return file;
    }

    /**
     * @param {string} name - service file name
     * @param {object} [options={}] - options for initializing the service class
     *
     * @return {Ynn.Service} the instance of service.
     */
    service( name, options = {} ) {
        const Service = this.app.services[ name ];

        if( !Service ) {
            const msg = `Service ${name} not exists`;
            ( this.console || this.app.console ).error( msg );
            this.logger.error( msg, options );
            this.throw( 500, 'Error' );
        }

        return utils.call( Service, this, this.ctx, Object.assign( {
            serviceName : name
        }, options ) );
    }

    /**
     * render template
     *
     * @param {string} file - the filename of template file or a template string
     * @param {object} [data={}] - the data for rendering the template
     * @param {boolean} [string=false] - defined if render the template as a template string instead to regard it as a file name.
     *
     * @return {string}
     */
    render( file, data = {}, string = false ) {
        const ctx = this.ctx;
        ctx.set( 'Content-Type', 'text/html' );

        if( string ) {
            return nunjucks.renderString( file, data );
        }
        const dir = path.resolve( this.app.root, this.config( 'app.view' ) || 'view' );
        file = path.resolve( dir, file );

        if( !fs.existsSync( file ) ) {
            this.logger.error( `template file ${file} not exists` );
            this.throw( 500, 'Error' );
        }

        return nunjucks.render( file, data );
    }

    assert() {
        return this.ctx.assert( ...arguments );
    }
}

module.exports = Runtime;
