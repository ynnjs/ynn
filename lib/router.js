const KoaRouter = require( '@lvchengbin/koa-router' );
const is = require( '@lvchengbin/is' );
const Console = require( './console' );

const EXECUTE = Symbol( 'execute' );
const MOUNTING_EXECUTE = Symbol( 'mounting#execute' );

class Router extends KoaRouter {
    constructor( app, callback ) {
        if( is.function( app ) ) {
            callback = app;
            app = null;
        }
        super( app );
        this.app = app;
        this.debugging = app.debugging;
        this.console = new Console( this, 'router' );
        this.callback = callback || ( () => {} );

        for( const method of this.methods ) {
            const name = method.toLowerCase();
            const m = this[ name ]; 

            this[ name ] = function( path, fn, ...args ) {
                return m.call( this, path, async ( ctx, next, ...args ) => {
                    return this[ EXECUTE ]( fn, ctx, next, ...args );
                }, ...args );
            };
        }
    }

    mount( path, rule, ...args ) {
        return this.any( '*', path, async ( ctx, next, ...args ) => {
            return this[ MOUNTING_EXECUTE ]( rule, ctx, next, ...args );
        }, ...args );
    }

    add( path, fn, ...args ) {
        return this.any( '*', path, async ( ctx, next, ...args ) => {
            return this[ EXECUTE ]( fn, ctx, next, ...args );
        }, ...args );
    }

    [ MOUNTING_EXECUTE ]( rule, ctx, next, ...args ) {
        const res = {};
        Object.defineProperty( res, 'ynnMounting', {
            enumerable : false,
            value : true
        } );

        if( is.function( rule ) ) {
            rule = rule( ctx, next, ...args );
        }

        if( is.string( rule ) ) {
            return this.callback( Object.assign( res, { module : rule } ), ctx, next, ...args );
        }

        if( is.plainObject( rule ) ) {
            if( rule.path ) {
                ctx.path = rule.path;
            }
            return this.callback( Object.assign( res, rule ), ctx, next, ...args );
        }

        if( is.promise( rule ) ) {
            return rule.then( v => {
                this[ MOUNTING_EXECUTE ]( v, ctx, next, ...args );
            } );
        }
    }

    [ EXECUTE ]( fn, ctx, next, ...args ) {
        if( !is.function( fn ) ) {
            return this.callback( fn, ctx, ...args );
        }
        const rules = fn( ctx, next, ...args );

        if( is.promise( rules ) ) {
            return rules.then( v => {
                if( is.plainObject( v ) ) {
                    this.callback( v, ctx, ...args );
                }
            } );
        }

        if( is.string( rules ) || is.plainObject( rules ) ) {
            return this.callback( rules, ctx, ...args );
        }
    }
}
module.exports = Router;
