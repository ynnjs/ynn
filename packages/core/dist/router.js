'use strict';
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/router.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/31/2021
 * Description:
 ******************************************************************/
var __classPrivateFieldGet = this && this.__classPrivateFieldGet || function( receiver, privateMap ) {
    if( !privateMap.has( receiver ) ) {
        throw new TypeError( 'attempted to get private field on non-instance' );
    }
    return privateMap.get( receiver );
};
var _cache, _push;
Object.defineProperty( exports, '__esModule', { value : true } );
exports.Router = void 0;
const path_to_regexp_1 = require( 'path-to-regexp' );
function match( pattern, path, keys ) {
    const matches = pattern.exec( path );
    if( !matches )
        return false;
    const params = {};
    keys.forEach( ( key, i ) => {
        matches[ i + 1 ] && ( params[ key.name ] = matches[ i + 1 ] );
    } );
    if( matches.groups ) {
        const { groups } = matches;
        for( const key of Object.keys( groups ) ) {
            groups[ key ] && ( params[ key ] = groups[ key ] );
        }
    }
    return { params, matches };
}
class Router {
    constructor() {
        this.rules = [];
        _cache.set( this, {} );
        _push.set( this, ( rule ) => {
            const keys = [];
            const pattern = path_to_regexp_1.pathToRegexp( rule[ 1 ], keys, rule[ 3 ] );
            this.rules.push( { rule, keys, pattern } );
        } );
    }

    get( ...args ) {
        __classPrivateFieldGet( this, _push ).call( this, [ 'GET', ...args ] );
    }

    post( ...args ) {
        __classPrivateFieldGet( this, _push ).call( this, [ 'POST', ...args ] );
    }

    put( ...args ) {
        __classPrivateFieldGet( this, _push ).call( this, [ 'PUT', ...args ] );
    }

    head( ...args ) {
        __classPrivateFieldGet( this, _push ).call( this, [ 'HEAD', ...args ] );
    }

    patch( ...args ) {
        __classPrivateFieldGet( this, _push ).call( this, [ 'PATCH', ...args ] );
    }

    delete( ...args ) {
        __classPrivateFieldGet( this, _push ).call( this, [ 'DELETE', ...args ] );
    }

    options( ...args ) {
        __classPrivateFieldGet( this, _push ).call( this, [ 'OPTIONS', ...args ] );
    }

    any( ...args ) {
        const [ methods, ...rest ] = args;
        /**
         * Uppercase the method(s) before appending in to the rules list, in order to avoid uppercasing the strings everytime in every request.
         */
        if( typeof methods === 'string' ) {
            __classPrivateFieldGet( this, _push ).call( this, [ methods.toUpperCase(), ...rest ] );
            return;
        }
        __classPrivateFieldGet( this, _push ).call( this, [ methods.map( m => m.toUpperCase() ), ...rest ] );
    }

    match( context ) {
        const { path, method } = context;
        const cacheKey = path + '\x0B' + method;
        if( __classPrivateFieldGet( this, _cache )[ cacheKey ] !== undefined )
            return __classPrivateFieldGet( this, _cache )[ cacheKey ];
        for( const item of this.rules ) {
            const { keys = [], pattern, rule } = item;
            const [ methods ] = rule;
            if( methods !== '*' ) {
                if( typeof methods === 'string' && methods !== method )
                    continue;
                if( Array.isArray( methods ) && !methods.includes( method ) )
                    continue;
            }
            const res = match( pattern, path, keys );
            if( res === false )
                continue;
            const args = res.matches.slice( 1 ); // .map( v => decodeURIComponent( v ) );
            return __classPrivateFieldGet( this, _cache )[ cacheKey ] = {
                params : res.params,
                matches : args,
                rule
            };
        }
        return __classPrivateFieldGet( this, _cache )[ cacheKey ] = false;
    }
}
exports.Router = Router;
_cache = new WeakMap(), _push = new WeakMap();
