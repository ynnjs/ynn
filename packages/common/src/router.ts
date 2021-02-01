/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/router.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/31/2021
 * Description:
 ******************************************************************/

import { pathToRegexp, Key, ParseOptions } from 'path-to-regexp';
import { Shift } from '@ynn/utility-types';
import { Context } from '../interfaces';

export type Pattern = string | RegExp | ( string | RegExp )[] | {
    pattern: string | RegExp | ( string | RegExp )[];
    options: ParseOptions;
};

export interface RouteMap {
    module?: string;
    controller?: string;
    action?: string;
}

export type Handler = string | RouteMap | ( ( ...args: unknown[] ) => unknown );

export type Rule = [
    methods: string | string[],
    pattern: Pattern,
    handler: Handler | Handler[]
];

export interface MatchResult {
    params: Readonly<Record<string, string>>;
    matches: readonly string[];
}

function match( pattern: Pattern, path: string, options: ParseOptions ): false | MatchResult {

    const keys: Key[] = [];
    const matches = pathToRegexp( pattern, keys, options ).exec( path );

    if( !matches ) return false;

    const params = {};

    keys.forEach( ( key: Key, i: number ): void => {
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

export class Router {

    rules: Rule[] = [];

    get( ...args: readonly Shift<Rule> ): void {
        this.rules.push( [ 'GET', ...args ] );
    }

    post( ...args: readonly Shift<Rule> ): void {
        this.rules.push( [ 'POST', ...args ] );
    }

    put( ...args: readonly Shift<Rule> ): void {
        this.rules.push( [ 'PUT', ...args ] );
    }

    head( ...args: readonly Shift<Rule> ): void {
        this.rules.push( [ 'HEAD', ...args ] );
    }

    patch( ...args: readonly Shift<Rule> ): void {
        this.rules.push( [ 'PATCH', ...args ] );
    }

    delete( ...args: readonly Shift<Rule> ): void {
        this.rules.push( [ 'DELETE', ...args ] );
    }

    options( ...args: readonly Shift<Rule> ): void {
        this.rules.push( [ 'OPTIONS', ...args ] );
    }

    any( ...args: readonly Rule ): void {
        const [ methods, ...rest ] = args;

        /**
         * Uppercase the method(s) before appending in to the rules list, in order to avoid uppercasing the strings everytime in every request.
         */
        if( typeof methods === 'string' ) {
            this.rules.push( [ methods.toUpperCase(), ...rest ] );
            return;
        }

        this.rules.push( [ methods.map( m => m.toUpperCase() ), ...rest ] );
    }

    match( context: Readonly<Context> ): false | ( MatchResult & { rule: Rule } ) {

        const { path, method } = context;

        for( const rule of this.rules ) {

            const [ methods, pattern ] = rule;

            if( methods !== '*' ) {
                if( typeof methods === 'string' && methods !== method ) continue;
                if( Array.isArray( methods ) && !methods.includes( method ) ) continue;
            }

            const res = 'pattern' in pattern ? match( pattern.pattern, path, pattern.options ) : match( pattern, path );

            if( res === false ) break;

            const args = res.matches.slice( 1 ); // .map( v => decodeURIComponent( v ) );

            return {
                params : res.params,
                matches : args,
                rule
            };
        }

        return false;
    }
}
