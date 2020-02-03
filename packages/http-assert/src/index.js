const deepEqual = require( 'deep-equal' );
const createError = require( 'http-errors' );
const is = require( '@lvchengbin/is' );
const types = require( './types' );
const indexOf = require( './indexof' );

const VALUE = Symbol( 'value' );

/**
 * assert( body.status, 400, 'message' )
 *   .is( 'int', 400, 'message' )
 *   .is( 'lowercase', 400, 'message' )
 *   .between( [ 1, 5 ], 400, 'message' )
 *   .length( [ 0, 1000 ], 400, 'message' )
 *   .regex( /^\d+$/, 400, 'message' )
 *   .json( fn, 400, 'message' )
 *   .custom( fn, 400, 'message' )
 */
class Assertion {
    constructor( value, status, msg, opts ) {
        this.value( value );
        this.status = status;
        if( !is.string( msg ) ) {
            this.msg = null;
            this.opts = msg;
        } else {
            this.msg = msg;
            this.opts = opts;
        }
        this.skip = false;
        this.promises = [];
        this.async = false;
        this.setDefault = false;
    }

    default( value ) {
        this.defaultValue = value;
        this.setDefault = true;
        if( !this.value() ) {
            this.value( value );
            this.skip = true;
        }
        return this;
    }

    undefined() {
        this.acceptUndefined = true;
        return this;
    }

    required( name, code = 400, message ) {
        return this.assert( this.value(), code, message || `${name} is required` );
    }

    value( v ) {
        /**
         * the default value can be an undefined
         */
        if( arguments.length ) {
            this[ VALUE ] = v;
            return this;
        }
        if( this.async ) {
            return Promise.all( this.promises ).then( () => this[ VALUE ] );
        }
        return this[ VALUE ];
    }

    /**
     * check the type of a parameter
     *
     * supported types
     * - email
     * - int/integer
     * - ip
     * - ipv4
     * - ipv6
     * - number
     * - url
     * - @todo date
     * - @todo time
     * - @todo dateTime
     * - @todo timestamp
     * - @todo mixedTime
     */
    is( type, ...args ) {
        if( !types.hasOwnProperty( type ) ) {
            throw new TypeError( `Checking unknown type ${type}.` );
        }
        const fn = types[ type ];

        if( is.string( fn ) ) {
            if( !is.function( is[ fn ] ) ) {
                throw new TypeError( '`Checking unknown type ${type}`' );
            }
            return this.assert( is[ fn ]( this.value() ), ...args );
        }
        if( is.function( fn ) ) {
            return this.assert( fn( this.value() ), ...args );
        }
    }

    gt( n, ...args ) {
        return this.assert( this.value() > n, ...args );
    }

    gte( n, ...args ) {
        return this.assert( this.value() >= n, ...args );
    }

    lt( n, ...args ) {
        return this.assert( this.value() < n, ...args );
    }

    lte( n, ...args ) {
        return this.assert( this.value() <= n, ...args );
    }

    between( interval, ...args ) {
        return this.assert( is.between( this.value(), ...interval ), ...args );
    }

    in( haystack, ...args ) {
        return this.assert( indexOf( haystack, this.value() ) !== -1, ...args );
    }

    length( interval, ...args ) {
        const v = this.value();
        const l = v ? v.length : 0;
        if( !is.array( interval ) ) {
            return this.assert( l == interval, ...args );
        }
        return this.assert( ( l >= interval[ 0 ] && l <= interval[ 1 ] ), ...args );
    }

    regex( reg, ...args ) {
        return this.assert( reg.test( this.value() ), ...args );
    }

    equal( data, ...args ) {
        return this.assert( data == this.value(), ...args );
    }

    notEqual( data, ...args ) {
        return this.assert( data != this.value(), ...args );
    }

    strictEqual( data, ...args ) {
        return this.assert( data === this.value(), ...args );
    }

    notStrictEqual( data, ...args ) {
        return this.assert( data !== this.value(), ...args );
    }

    deepEqual( data, ...args ) {
        return this.assert( deepEqual( this.value(), data ), ...args );
    }

    notDeepEqual( data, ...args ) {
        return this.assert( !deepEqual( this.value(), data ), ...args );
    }

    jsonstr( ...args ) {
        let res = false;
        let fn;

        if( is.function( args[ 0 ] ) ) {
            fn = args.shift();
        }
        try {
            const json = JSON.parse( this.value() );
            res = is.function( fn ) ? fn.call( this, json, this ) : true
        } catch( e ) {
            res = false;
        }
        return this.assert( res, ...args );
    }

    json( ...args ) {
        const value = this.value();
        let res = is.plainObject( value ) || is.array( value );

        if( !res ) {
            try {
                JSON.parse( value );
                res = true;
            } catch( e ) {
                res = false;
            }
        }
        return this.assert( res, ...args );
    }

    object( ...args ) {
        const type = [ '*', '{}', '[]' ].indexOf( args[ 0 ] ) > -1 ? args[ 0 ] : '*';
        const value = this.value();
        if( type === '[]' ) {
            return this.assert( is.array( value ), ...args );
        }
        if( type === '{}' ) {
            return this.assert( value && is.object( value ) && !is.array( value ), ...args );
        } 
        return this.assert( value && ( is.object( value ) || is.array( value ) ), ...args );
    }

    custom( fn, ...args ) {
        const res = fn.call( this, this.value(), this );
        if( !is.promise( res ) ) {
            return this.assert( res, ...args );
        }
        this.async = true;
        const promise = res.then( r => {
            this.assert( r, ...args );
        } ).catch( () => {
            this.assert( false, ...args );
        } );

        this.promises.push( promise );
        return this;
    }

    mutate( value ) {
        if( is.function( value ) ) {
            this.value( value.call( this, this.value() ) );
            return this;
        }
        this.value( value );
        return this;
    }

    assert( value, ...args ) {
        if( this.skip || value ) return this;
        if( this.setDefault ) {
            this.value( this.defaultValue );
            this.skip = true;
            return this;
        }
        if( this.acceptUndefined && is.undefined( this.value() ) ) return this;
        this.throw( ...args );
    }

    throw( status, msg, opts ) {
        if( !is.integer( status ) ) {
            opts = msg;
            msg = status;
            status = this.status;
        }

        if( !is.string( msg ) && !is.error( msg ) ) {
            opts = msg;
            msg = null;
        }
        msg || ( msg = this.msg );
        throw createError( status, msg, opts || this.opts );
    }
}

function assert( value, status, msg, opts ) {
    if( arguments.length === 1 || value ) {
        return new Assertion( ...arguments );
    }
    throw createError( status, msg, opts );
}

assert.Assertion = Assertion;

module.exports = assert;
