/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/logger.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 05/02/2021
 * Description:
 ******************************************************************/

import util from 'util';
import clistyle, { StyleOptions } from 'cli-style';
import { Logger } from '../interfaces';

type Messages = [ any, ...any[] ]; // eslint-disable-line @typescript-eslint/no-explicit-any

type OptionsStyles = Record<keyof Logger, StyleOptions>;

export type LoggerServiceOptions = {
    levels?: ( keyof Logger )[] | boolean;
    styles?: Partial<OptionsStyles> | false;
};

const styles = {
    error : { color : 'red' },
    warn : { color : 'orange' },
    info : { color : 'green' },
    debug : { color : 'cyan' },
    trace : { color : 'white' }
};

export class LoggerService implements Logger {

    private static print( style: StyleOptions, ...args: Messages ): void {
        process.stdout.write( clistyle( util.format( ...args ) + '\n', style ) );
    }

    static error( style: StyleOptions, ...args: Messages ): void {
        this.print( style && { ...styles.error, ...style }, ...args );
    }

    static warn( style: StyleOptions, ...args: Messages ): void {
        this.print( style && { ...styles.warn, ...style }, ...args );
    }

    static info( style: StyleOptions, ...args: Messages ): void {
        this.print( style && { ...styles.info, ...style }, ...args );
    }

    static debug( style: StyleOptions, ...args: Messages ): void {
        this.print( style && { ...styles.debug, ...style }, ...args );
    }

    #levels: ( keyof Logger )[] | boolean = true;

    #styles: Record<keyof Logger, StyleOptions> | false = { ...styles };

    constructor( options: LoggerServiceOptions = {} ) {
        if( typeof options.levels !== 'undefined' ) {
            this.#levels = options.levels;
        }
        if( options.styles === false ) {
            this.#styles = false;
        } else {
            this.#styles = {
                ...this.#styles as OptionsStyles,
                ...options.styles as Exclude<LoggerServiceOptions[ 'styles' ], false>
            };
        }
    }

    #call = ( name: keyof Logger, style: StyleOptions, ...args: Messages ): void => {
        if( !this.#enabled( name ) ) return;
        LoggerService[ name ]( style, ...args );
    };

    #enabled = ( name: keyof Logger ): boolean => {
        if( this.#levels === false ) return false;
        if( this.#levels === true ) return true;
        return this.#levels.includes( name );
    };

    error( ...args: Messages ): void {
        this.#call( 'error', this.#styles && this.#styles.error, ...args );
    }

    warn( ...args: Messages ): void {
        this.#call( 'warn', this.#styles && this.#styles.warn, ...args );
    }

    info( ...args: Messages ): void {
        this.#call( 'info', this.#styles && this.#styles.info, ...args );
    }

    debug( ...args: Messages ): void {
        this.#call( 'debug', this.#styles && this.#styles.debug, ...args );
    }
}
