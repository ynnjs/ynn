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
import { Logger } from '@ynn/common';

type OptionsStyles = Record<keyof Logger, StyleOptions>;

type Messages = [ any, ...any[] ]; // eslint-disable-line @typescript-eslint/no-explicit-any

export type DebugOptions = {
    levels?: ( keyof Logger )[] | boolean;
    styles?: Partial<OptionsStyles> | false;
};

const styles = {
    log : { color : 'green' },
    error : { color : 'red' },
    warn : { color : 'orange' },
    debug : { color : 'cyan' }
};

export default class Debug implements Logger {

    private static print( style: StyleOptions, ...args: Messages ): void {
        process.stdout.write( clistyle( util.format( ...args ) + '\n', style ) );
    }

    static log( style: StyleOptions, ...args: Messages ): void {
        this.print( style && { ...styles.log, ...style }, ...args );
    }

    static error( style: StyleOptions, ...args: Messages ): void {
        this.print( style && { ...styles.error, ...style }, ...args );
    }

    static warn( style: StyleOptions, ...args: Messages ): void {
        this.print( style && { ...styles.warn, ...style }, ...args );
    }

    static debug( style: StyleOptions, ...args: Messages ): void {
        this.print( style && { ...styles.debug, ...style }, ...args );
    }

    #levels: ( keyof Logger )[] | boolean = true;

    #styles: Record<keyof Logger, StyleOptions> | false = { ...styles };

    constructor( options: DebugOptions = {} ) {
        if( typeof options.levels !== 'undefined' ) {
            this.#levels = options.levels;
        }
        if( options.styles === false ) {
            this.#styles = false;
        } else {
            this.#styles = {
                ...( this.#styles as OptionsStyles ),
                ...( options.styles as Exclude<DebugOptions[ 'styles' ], false> )
            };
        }
    }

    #call = ( name: keyof Logger, style: StyleOptions, ...args: Messages ): void => {
        if( !this.#enabled( name ) ) return;
        Debug[ name ]( style, ...args );
    };

    #enabled = ( name: keyof Logger ): boolean => {
        if( this.#levels === false ) return false;
        if( this.#levels === true ) return true;
        return this.#levels.includes( name );
    };

    log( ...args: Messages ): void {
        this.#call( 'log', this.#styles && this.#styles.log, ...args );
    }

    error( ...args: Messages ): void {
        this.#call( 'error', this.#styles && this.#styles.error, ...args );
    }

    warn( ...args: Messages ): void {
        this.#call( 'warn', this.#styles && this.#styles.warn, ...args );
    }

    debug( ...args: Messages ): void {
        this.#call( 'debug', this.#styles && this.#styles.debug, ...args );
    }
}
