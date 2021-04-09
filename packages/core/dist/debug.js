'use strict';
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/debug.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/16/2020
 * Description:
 ******************************************************************/
var __classPrivateFieldSet = this && this.__classPrivateFieldSet || function( receiver, privateMap, value ) {
    if( !privateMap.has( receiver ) ) {
        throw new TypeError( 'attempted to set private field on non-instance' );
    }
    privateMap.set( receiver, value );
    return value;
};
var __classPrivateFieldGet = this && this.__classPrivateFieldGet || function( receiver, privateMap ) {
    if( !privateMap.has( receiver ) ) {
        throw new TypeError( 'attempted to get private field on non-instance' );
    }
    return privateMap.get( receiver );
};
var __importDefault = this && this.__importDefault || function( mod ) {
    return mod && mod.__esModule ? mod : { 'default' : mod };
};
var _levels, _styles, _call, _enabled;
Object.defineProperty( exports, '__esModule', { value : true } );
const util_1 = __importDefault( require( 'util' ) );
const cli_style_1 = __importDefault( require( 'cli-style' ) );
const styles = {
    log : { color : 'green' },
    error : { color : 'red' },
    warn : { color : 'orange' },
    debug : { color : 'cyan' }
};
class Debug {
    constructor( options = {} ) {
        _levels.set( this, true );
        _styles.set( this, { ...styles } );
        _call.set( this, ( name, style, ...args ) => {
            if( !__classPrivateFieldGet( this, _enabled ).call( this, name ) )
                return;
            Debug[ name ]( style, ...args );
        } );
        _enabled.set( this, ( name ) => {
            if( __classPrivateFieldGet( this, _levels ) === false )
                return false;
            if( __classPrivateFieldGet( this, _levels ) === true )
                return true;
            return __classPrivateFieldGet( this, _levels ).includes( name );
        } );
        if( typeof options.levels !== 'undefined' ) {
            __classPrivateFieldSet( this, _levels, options.levels );
        }
        if( options.styles === false ) {
            __classPrivateFieldSet( this, _styles, false );
        } else {
            __classPrivateFieldSet( this, _styles, {
                ...__classPrivateFieldGet( this, _styles ),
                ...options.styles
            } );
        }
    }

    static print( style, ...args ) {
        process.stdout.write( cli_style_1.default( util_1.default.format( ...args ) + '\n', style ) );
    }

    static log( style, ...args ) {
        this.print( style && { ...styles.log, ...style }, ...args );
    }

    static error( style, ...args ) {
        this.print( style && { ...styles.error, ...style }, ...args );
    }

    static warn( style, ...args ) {
        this.print( style && { ...styles.warn, ...style }, ...args );
    }

    static debug( style, ...args ) {
        this.print( style && { ...styles.debug, ...style }, ...args );
    }

    log( ...args ) {
        __classPrivateFieldGet( this, _call ).call( this, 'log', __classPrivateFieldGet( this, _styles ) && __classPrivateFieldGet( this, _styles ).log, ...args );
    }

    error( ...args ) {
        __classPrivateFieldGet( this, _call ).call( this, 'error', __classPrivateFieldGet( this, _styles ) && __classPrivateFieldGet( this, _styles ).error, ...args );
    }

    warn( ...args ) {
        __classPrivateFieldGet( this, _call ).call( this, 'warn', __classPrivateFieldGet( this, _styles ) && __classPrivateFieldGet( this, _styles ).warn, ...args );
    }

    debug( ...args ) {
        __classPrivateFieldGet( this, _call ).call( this, 'debug', __classPrivateFieldGet( this, _styles ) && __classPrivateFieldGet( this, _styles ).debug, ...args );
    }
}
exports.default = Debug;
_levels = new WeakMap(), _styles = new WeakMap(), _call = new WeakMap(), _enabled = new WeakMap();
