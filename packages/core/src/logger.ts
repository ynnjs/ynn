/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/logger.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/11/2020
 * Description: 
 ******************************************************************/

import { StyleOptions } from 'cli-style';

/**
 * Simple function for logging which has arguments just matches util.format method in nodejs.
 */
export type LogFunction = ( msg: any, ...args ) => any;

export interface Logger {
    log: LogFunction;
    error: LogFunction;
    warn: LogFunction;
    debug?: LogFunction;
    verbose?: LogFunction;
}

export type DefaultLoggerOptions = {
    levels?: Array<keyof Logger>;
    styles?: Record<keyof Logger, StyleOptions>;
};

export class DefaultLogger implements Logger {

    #call = ( name: keyof Logger, ...messages: any[] ): any => {
        if( !this.#enabled( name ) ) return;
        return DefaultLogger[ name ]( ...messages );
    }

    #enabled = ( name: keyof Logger ) => {
        if( this.#levels === false ) return false;
        if( this.#levels === true ) return true;
        return this.#levels.includes( name );
    }

    #levels: string[] | boolean = true;
    #styles: Record<keyof Logger, StyleOptions> = {
        log : { color : 'grey' },
        error : { color : 'red' },
        warn : { color : 'orange' },
        debug : { color : 'cyan' },
        verbose : { color : 'blue' }
    };

    constructor( options: DefaultLoggerOptions = {} ) {
        options.levels && ( this.#levels = options.levels );
        options.styles && ( this.#styles = options.styles );
    }

    log( msg, ...args ) {
        this.#call( 'log', msg, ...args );
    }

    error( msg, ...args ) {
        this.#call( 'error', msg, ...args );
    }

    warn( msg, ...args ) {
        this.#call( 'warn', msg, ...args );
    }

    debug( msg, ...args ) {
        this.#call( 'debug', msg, ...args );
    }

    verbose( msg, ...args ) {
        this.#call( 'verbose', msg, ...args );
    }

    static log( msg, ...args ) {
        this.print( ...messages );
    }

    static error( msg, ...args ) {
        this.print( ...messages );
    }

    static warn( msg, ...args ) {
        this.print( ...messages );
    }

    static debug( msg, ...args ) {
        this.print( ...messages );
    }

    static verbose( msg, ...args ): void {
        this.print( ...messages );
    }

    private static print( message, {} ): void {
        process.stdout.write();
    }
}
