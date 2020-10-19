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

export type DebugLoggerOptions = {
    levels?: Array<keyof Logger>;
    styles?: Record<keyof Logger, StyleOptions>;
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

    #levels: string[] | boolean = true;
    #styles: Record<keyof Logger, StyleOptions> = { ...styles };

    constructor( options: DebugLoggerOptions = {} ) {
        options.levels && ( this.#levels = options.levels );
        this.#styles = { ...this.#styles, ...options.styles };
    }

    log( msg, ...args ) {
        this.#call( 'log', this.#styles.log, msg, ...args );
    }

    error( msg, ...args ) {
        this.#call( 'error', this.#styles.error, msg, ...args );
    }

    warn( msg, ...args ) {
        this.#call( 'warn', msg, this.#styles.warn, msg, ...args );
    }

    debug( msg, ...args ) {
        this.#call( 'debug', msg, this.#styles.debug, msg, ...args );
    }

    verbose( msg, ...args ) {
        this.#call( 'verbose', msg, this.#styles.verbose, msg, ...args );
    }

    static log( style, msg, ...args ) {
        this.print( { ...styles.log, ...style }, msg, ...args );
    }

    static error( style, msg, ...args ) {
        this.print( { ...styles.error, ...style }, msg, ...args );
    }

    static warn( style, msg, ...args ) {
        this.print( { ...styles.warn, ...style }, msg, ...args );
    }

    static debug( style, msg, ...args ) {
        this.print( { ...styles.debug, ...style }, msg, ...args );
    }

    static verbose( style, msg, ...args ): void {
        this.print( { ...styles.verbose, ...style }, msg, ...args );
    }

    private static print( style: StyleOptions, msg: any, ...args: any ): void {
        process.stdout.write( clistyle( util.format( msg, ...args ), style ) );
    }
}
