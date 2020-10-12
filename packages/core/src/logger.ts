/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/logger.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/11/2020
 * Description: 
 ******************************************************************/

export interface Logger {
    log( ...messages: any[] ): any;
    error( ...messages: any[] ): any;
    warn( ...messages: any[] ): any;
    debug?( ...messages: any[] ): any;
    verbose?( ...messages: any[] ): any;
}

export type DefaultLoggerOptions = {
    levels?: Array<keyof Logger>;
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

    constructor( options: DefaultLoggerOptions = {} ) {
        options.levels && ( this.#levels = options.levels );
    }

    log( ...messages ) {
        this.#call( 'log', ...messages );
    }

    error( ...messages ) {
        this.#call( 'error', ...messages );
    }

    warn( ...messages ) {
        this.#call( 'warn', ...messages );
    }

    debug( ...messages ) {
        this.#call( 'debug', ...messages );
    }

    verbose( ...messages ) {
        this.#call( 'verbose', ...messages );
    }

    static log( ...messages ) {
        this.print( ...messages );
    }

    static error( ...messages ) {
    }

    static warn( ...messages ) {
    }

    static debug( ...messages ) {
    }

    static verbose( ...messages ) {
    }

    private static print() {
        process.stdout.write();
    }
}
