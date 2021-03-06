const fs = require( 'fs' );
const path = require( 'path' );
const Koa = require( 'koa' );
const assert = require( 'ynn-http-assert' );
const is = require( '@lvchengbin/is' );
const Base = require( './base' );
const utils = require( './utils' );
const output = require( './output' );

class Runtime extends Base {
    constructor( ctx, options = {} ) {
        super();

        if( ctx instanceof Koa ) {
            this.app = ctx;
            this.ctx = null;
        } else {
            this.ctx = ctx;
            this.app = ctx.app;
        }
        this.rsc = this.app.rsc;
        this.logger = this.app.logger;

        if( !Object.prototype.hasOwnProperty.call( options, 'debugging' ) ) {
            options.debugging = this.app.debugging;
        }

        Object.assign( this, options );
        this.output = output( this );
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
    async response( data, type, cb = null ) {
        const ctx = this.ctx;

        data = await data;

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

    config() {
        return this.app.config( ...arguments );
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
    service() {
        if( this.ctx ) {
            return this.app.service( this.ctx, ...arguments );
        }
        return this.app.service( ...arguments );
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
    async render( file, data = {} ) {
        const ctx = this.ctx;
        if( !ctx.type ) ctx.type = 'text/html';
        const dir = path.resolve( this.app.root, this.config( 'view.path', 'view' ) );

        file = path.resolve( dir, file );

        const ext = path.extname( file ).substr( 1 );
        const c = this.config( `view.map.${ext}`, this.config( 'view.map.*' ) );

        if( !c ) {
            if( ext === 'html' ) return utils.read( file, { cache : true } );
            this.output.error( `no specified template engine for ${ext} file.`, { file } );
            this.throw( 500 );
        }
        return c.render( file, data, this.ctx, this );
    }

    assert( ...args ) {
        return assert( ...args );
        //return this.ctx.assert( ...arguments );
    }
}

module.exports = Runtime;
