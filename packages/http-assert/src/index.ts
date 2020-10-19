/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/16/2020
 * Description: 
 ******************************************************************/

import { URL } from 'url';
import typeis from 'type-is';
import statuses from 'statuses';
import deepEqual from 'deep-equal';
import createError from 'http-errors';
import is from '@lvchengbin/is';

const contains = ( list: any[], searchElement: any ): boolean => {
    for( const item of list ) {
        if( item == searchElement ) return true; 
    }
    return false;
}

export type Status = number;
export type Message = Error | string;
export type Opts = Record<string, any>;

export type HttpErrorArgs<S = Status, M = Message, O = Opts> = []
    | [ S | M | O ]
    | [ S | M, O ] | [ S, M | O ]
    | [ S, M, O ];


type HttpErrorArgsObject = {
    status?: Status;
    message?: Message;
    opts?: Opts;
}

function settleHttpErrorArgs( ...args: HttpErrorArgs ): HttpErrorArgsObject {
    let [ status, message, opts ] = args;

    if( !Number.isInteger( status ) ) {
        opts = message as Opts;
        message = status as Message;
        status = undefined;
    }

    if( message && typeof message !== 'string' ) {
        opts = message as Opts;
        message = undefined;
    }

    const res: HttpErrorArgsObject = {};

    status && ( res.status = status as Status );
    message && ( res.message = message as Message );
    opts && ( res.opts = opts as Opts );

    return res;
}

export class Assertion {

    #status: Status = 500;
    #message?: Message;
    #value: any;
    #opts: Opts = {};
    #skip = false;
    #promises: Promise<any>[] = [];
    #async = false;
    #required = false;
    #setDefault = false;
    #defaultValue: any;

    constructor( value: any, ...args: HttpErrorArgs ) {
        this.set( value );

        const { status, message, opts } = settleHttpErrorArgs( ...args );

        status && ( this.#status = status );
        message && ( this.#message = message );
        opts && ( this.#opts = opts );
    }

    default( value?: any ): this {
        if( !arguments.length ) value = undefined;
        this.#defaultValue = value;
        this.#setDefault = true;

        if( !this.#value ) {
            this.set( value );
            this.skip();
        }
        return this;
    }

    set( value: any ): this {
        this.#value = value;
        return this;
    }

    value() {
        if( !this.#async ) return this.#value;
        return Promise.all( this.#promises ).then( () => this.#value ).catch( () => {
            this.assert( false );
        } );
    }

    required( status = 400, message = statuses.message[ 400 ] ): this {
        this.#required = true;
        return this.assert( typeof this.#value !== 'undefined', status, message as string );
    }

    /**
     * alias for integer
     */
    int( transform = true, ...args: HttpErrorArgs ): this {
        return this.integer( transform, ...args );
    }

    integer( transform = true, ...args: HttpErrorArgs ): this {
        if( is.integer( this.#value ) ) {
            transform && ( this.#value = parseInt( this.#value ) );
            return this.assert( true, ...args );
        }
        return this.assert( false, ...args );
    }

    number( ...args: HttpErrorArgs ): this {
        return this.assert( is.number( this.#value ), ...args );
    }

    url( ...args: HttpErrorArgs ): this {
        try {
            new URL( this.#value );
            return this.assert( true, ...args );
        } catch( e ) {
            return this.assert( false, ...args );
        }
    }

    date() {
    }

    /**
     * YYYY-MM-DD HH:mm:ss
     */
    time() {
    }

    dateTime( ...args: HttpErrorArgs ): this {
        const date = new Date( this.#value );
        return this.assert( date.toString() !== 'Invalid Date', ...args );
    }

    timestamp() {
    }

    gt( n: number, ...args: HttpErrorArgs ): this {
        return this.assert( this.#value > n, ...args );
    }

    gte( n: number, ...args: HttpErrorArgs ): this {
        return this.assert( this.#value >= n, ...args );
    }

    lt( n: number, ...args: HttpErrorArgs ): this {
        return this.assert( this.#value < n, ...args );
    }

    lte( n: number, ...args: HttpErrorArgs ): this {
        return this.assert( this.#value <= n, ...args );
    }

    between( lower: number, upper: number, ...args: HttpErrorArgs ): this {
        return this.assert( this.#value >= lower && this.#value <= upper, ...args );
    }

    in( list: any[], ...args: HttpErrorArgs ): this {
        return this.assert( contains( list, this.#value ), ...args );
    }

    strictIn( list: any[], ...args: HttpErrorArgs ): this {
        return this.assert( list.includes( this.#value ), ...args );
    }

    notIn( list: any[], ...args: HttpErrorArgs ): this {
        return this.assert( !contains( list, this.#value ), ...args );
    }

    strictNotIn( list: any[], ...args: HttpErrorArgs ): this {
        return this.assert( !list.includes( this.#value ), ...args );
    }

    length( range: number | [ number, number ], ...args: HttpErrorArgs ): this {
        const l = this.#value ? String( this.#value ).length : 0;
        if( Array.isArray( range ) ) {
            return this.assert( l >= range[ 0 ] && l <= range[ 1 ], ...args );
        }
        return this.assert( l === range as number, ...args );
    }

    regex( reg: RegExp, ...args: HttpErrorArgs ): this {
        return this.assert( reg.test( this.#value ), ...args );
    }

    equal( x: unknown, ...args: HttpErrorArgs ): this {
        return this.assert( x == this.#value, ...args );
    }

    notEqual( x: unknown, ...args: HttpErrorArgs ): this {
        return this.assert( x != this.#value, ...args );
    }

    strictEqual( x: unknown, ...args: HttpErrorArgs ): this {
        return this.assert( x === this.#value, ...args );
    }

    notStrictEqual( x: unknown, ...args: HttpErrorArgs ): this {
        return this.assert( x !== this.#value, ...args );
    }

    deepEqual( x: unknown, ...args: HttpErrorArgs ): this {
        return this.assert( deepEqual( this.#value, x ), ...args );
    }

    notDeepEqual( x: unknown, ...args: HttpErrorArgs ): this {
        return this.assert( !deepEqual( this.#value, x ), ...args );
    }

    jsonstring( mutate = true, ...args: HttpErrorArgs ): this {
        if( typeof this.#value !== 'string' ) return this.assert( false, ...args );
        try {
            const json = JSON.parse( this.#value );
            mutate && this.set( json );
            return this.assert( true, ...args );
        } catch( e ) {
            return this.assert( false, ...args );
        }
    }

    json( type = 'application/x-www-form-urlencoded', mutate = true, ...args: HttpErrorArgs ): this {
        if( typeis.is( type, 'json' ) ) {
            return this.assert( typeof this.#value !== 'undefined', ...args );
        }

        if( typeof this.#value !== 'string' ) return this.assert( false, ...args );

        try {
            const json = JSON.parse( this.#value );
            mutate && this.set( json );
            return this.assert( true, ...args );
        } catch( e ) {
            return this.assert( false, ...args );
        }
    }

    object( ...args: HttpErrorArgs ): this {
        const v = this.#value;
        return this.assert( v && !Array.isArray( v ) && typeof v === 'object', ...args );
    }

    array( ...args: HttpErrorArgs ): this {
        return this.assert( this.#value && Array.isArray( this.#value ), ...args );
    }

    custom( fn: ( ...x: any[] ) => any, ...args: HttpErrorArgs ): this {
        const res = fn.call( this, this.#value, this );
        if( typeof res.then !== 'function' ) {
            return this.assert( res, ...args );
        }
        this.#async = true;

        this.#promises.push( res.then(
            ( x: boolean ): void => { this.assert( x, ...args ) },
            () => { this.assert( false, ...args ) }
        ) );

        return this; 
    }

    skip(): this {
        this.#skip = true;
        return this;
    }

    assert( x: boolean, ...args: HttpErrorArgs ): this {
        if( x || this.#skip ) return this;
        if( this.#setDefault ) {
            this.set( this.#defaultValue );
            this.skip();
            return this;
        }
        if( !this.#required && typeof this.#value === 'undefined' ) return this;
        this.throw( ...args );
        return this;
    }

    throw( ...args: HttpErrorArgs ): void {
        const {
            status = this.#status,
            message = this.#message,
            opts = this.#opts
        } = settleHttpErrorArgs( ...args );

        if( message ) {
            throw createError( status, message, opts );
        }
        throw createError( status, opts );
    }
}

export default function assert( value: any, ...args: HttpErrorArgs ): Assertion {
    return new Assertion( value, ...args );
}
