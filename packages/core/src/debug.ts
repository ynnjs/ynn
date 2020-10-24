/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/debug.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/16/2020
 * Description: 
 ******************************************************************/

import util from 'util';
import clistyle, { StyleOptions } from 'cli-style';
import Logger from './logger';

type OptionsStyles = Record<keyof Logger, StyleOptions>;

export type DebugLoggerOptions = {
    levels?: Array<keyof Logger> | boolean;
    styles?: Partial<OptionsStyles> | false;
};

const styles = {
    log : { color : 'grey' },
    error : { color : 'red' },
    warn : { color : 'orange' },
    debug : { color : 'cyan' },
    verbose : { color : 'blue' }
};

export default class DebugLogger implements Logger {

    #call = ( name: keyof Logger, style: StyleOptions, msg: any, ...args: any[] ): any => {
        if( !this.#enabled( name ) ) return;
        return DebugLogger[ name ]( style, msg, ...args );
    }

    #enabled = ( name: keyof Logger ) => {
        if( this.#levels === false ) return false;
        if( this.#levels === true ) return true;
        return this.#levels.includes( name );
    }

    #levels: Array<keyof Logger> | boolean = true;
    #styles: Record<keyof Logger, StyleOptions> | false = { ...styles };

    constructor( options: DebugLoggerOptions = {} ) {
        if( typeof options.levels !== 'undefined' ) {
            this.#levels = options.levels;
        }
        if( options.styles === false ) {
            this.#styles = false;
        } else {
            this.#styles = {
                ...( this.#styles as OptionsStyles ),
                ...( options.styles as Exclude<DebugLoggerOptions[ 'styles' ], false> )
            };
        }
    }

    log( msg, ...args ) {
        this.#call( 'log', this.#styles && this.#styles?.log, msg, ...args );
    }

    error( msg, ...args ) {
        this.#call( 'error', this.#styles && this.#styles?.error, msg, ...args );
    }

    warn( msg, ...args ) {
        this.#call( 'warn', this.#styles && this.#styles?.warn, msg, ...args );
    }

    debug( msg, ...args ) {
        this.#call( 'debug', this.#styles && this.#styles?.debug, msg, ...args );
    }

    verbose( msg, ...args ) {
        this.#call( 'verbose', this.#styles && this.#styles?.verbose, msg, ...args );
    }

    static log( style, msg, ...args ) {
        this.print( style && { ...styles.log, ...style }, msg, ...args );
    }

    static error( style, msg, ...args ) {
        this.print( style && { ...styles.error, ...style }, msg, ...args );
    }

    static warn( style, msg, ...args ) {
        this.print( style && { ...styles.warn, ...style }, msg, ...args );
    }

    static debug( style, msg, ...args ) {
        this.print( style && { ...styles.debug, ...style }, msg, ...args );
    }

    static verbose( style, msg, ...args ): void {
        this.print( style && { ...styles.verbose, ...style }, msg, ...args );
    }

    private static print( style: StyleOptions, msg: any, ...args: any ): void {
        process.stdout.write( clistyle( util.format( msg, ...args ), style ) );
    }
}
