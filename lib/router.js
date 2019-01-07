const KoaRouter = require( '@lvchengbin/koa-router' );
const is = require( '@lvchengbin/is' );
const Console = require( './console' );
const Runtime = require( './runtime' );

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

            this[ name ] = function( path, fn ) {
                if( is.array( fn ) ) {
                    for( const f of fn ) {
                        this[ name ]( path, f );
                    }
                    return;
                }
                return m.call( this, path, async ( ctx, next ) => {
                    return this[ EXECUTE ]( fn, ctx, next );
                } );
            };
        }
    }

    mount( path, rule ) {

        if( is.array( rule ) ) {
            for( const r of rule ) {
                this.mount( path, r );
            }
            return;
        }
        return this.any( '*', path, async ( ctx, next ) => {
            return this[ MOUNTING_EXECUTE ]( rule, ctx, next );
        } );
    }

    add( path, fn ) {

        if( is.array( fn ) ) {
            for( const f of fn ) {
                this.add( path, f );
            }
            return;
        }
        return this.any( '*', path, async ( ctx, next ) => {
            return this[ EXECUTE ]( fn, ctx, next );
        } );
    }

    [ MOUNTING_EXECUTE ]( rule, ctx, next ) {
        const res = {};
        Object.defineProperty( res, 'ynnMounting', {
            enumerable : false,
            value : true
        } );

        if( is.function( rule ) ) {
            rule = rule( ctx, next );
        }

        if( is.string( rule ) ) {
            return this.callback( Object.assign( res, { module : rule } ), ctx, next );
        }

        if( is.plainObject( rule ) ) {
            if( rule.path ) {
                ctx.path = rule.path;
            }
            return this.callback( Object.assign( res, rule ), ctx, next );
        }

        if( is.promise( rule ) ) {
            return rule.then( v => {
                this[ MOUNTING_EXECUTE ]( v, ctx, next );
            } );
        }
    }

    [ EXECUTE ]( fn, ctx, next ) {
        if( !is.function( fn ) || is.class( fn ) ) {
            return this.callback( fn, ctx, next );
        }

        const rules = fn( ctx, next, new Runtime( ctx ) );

        if( is.promise( rules ) ) {
            return rules.then( v => {
                if( is.plainObject( v ) ) {
                    return this.callback( v, ctx, next );
                }
            } );
        }

        if( is.string( rules ) || is.plainObject( rules ) ) {
            return this.callback( rules, ctx, next );
        }
    }
}
module.exports = Router;
