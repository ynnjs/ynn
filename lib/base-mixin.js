const Events = require( 'events' );
const Sequence = require( '@lvchengbin/sequence' );
const is = require( '@lvchengbin/is' );
const loader = require( './loader' );
const utils = require( './utils' );

const BASE_READY = Symbol( 'base#ready' );
const BASE_RESOLVE = Symbol( 'base#resolve' );

module.exports = ( Base = Events ) => {
    return class extends Base {
        constructor() {
            super();
            this[ BASE_READY ] = new Promise( r => ( this[ BASE_RESOLVE ] = r ) );
            process.nextTick( () => this.construct() );
        }

        construct() {
            return Sequence.all( [
                () => is.function( this._init ) ? this._init() : true,
                () => {
                    const getPrototypeOf = Object.getPrototypeOf;
                    const getOwnPropertyNames = Object.getOwnPropertyNames;

                    const properties = x => {
                        const proto = getPrototypeOf( x );
                        const res = new Set( [ ...getOwnPropertyNames( x ), ...getOwnPropertyNames( proto ) ] );
                        if( proto.constructor !== Base.prototype.constructor ) {
                            return new Set( [ ...res, ...properties( proto ) ] );
                        }
                        return res;
                    };

                    const promises = [];

                    for( const property of properties( this ) ) {
                        /**
                         * please don't change the order of the conditions in the if statement
                         * because this[ property ] will execute the getter properties
                         */
                        if( /^_init.+/.test( property ) && is.function( this[ property ] ) ) {
                            promises.push( this[ property ]() );
                        }
                    }

                    return Promise.all( promises );
                },
                () => is.function( this._afterinit ) ? this._afterinit() : true,
                () => this[ BASE_RESOLVE ]()
            ] ).catch( res => {
                const e = res[ res.length - 1 ].reason;
                this.console ? this.console.error( e ) : console.error( e );
                this.logger && this.logger.error( e );
            } );
        }

        ready( f ) {
            return f ? this[ BASE_READY ].then( () => f.call( this, this ) ) : this[ BASE_READY ];
        }

        loadFiles( dir, filter ) {
            if( !utils.isdir( dir ) ) return false;
            try {
                return loader.files( dir, filter );
            } catch( e ) {
                this.console.error( e );
                throw e;
            }
        }
    };
};
