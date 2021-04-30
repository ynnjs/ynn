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
import { Context } from './context';

export type Pattern = string | RegExp | ( string | RegExp )[];

export interface RouteMap {
    module?: string;
    controller?: string;
    action?: string;
    path?: string;
}

export type RouterHandler = ( ctx: Context, params: Record<string, string>, matches: string[] ) => RouteMap | string | Context | Promise<RouteMap | string | Context> | void;

export type RouterRule = [
    methods: string | string[],
    pattern: Pattern,
    dest: RouterHandler | RouteMap | string,
    options?: ParseOptions
];

export interface MatchResult {
    params: Readonly<Record<string, string>>;
    matches: string[];
}

export type Matches = MatchResult & { rule: RouterRule };

function match( pattern: RegExp, path: string, keys: Key[] ): false | MatchResult {

    const matches = pattern.exec( path );

    if( !matches ) return false;

    const params: Record<string, string> = {};

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

    rules: ( { rule: RouterRule; keys?: Key[]; pattern: RegExp } )[] = [];

    #cache: Record<string, Matches | false> = {};

    #push = ( rule: RouterRule ): void => {
        const keys: Key[] = [];
        const pattern = pathToRegexp( rule[ 1 ], keys, rule[ 3 ] );
        this.rules.push( { rule, keys, pattern } );
    };

    get( ...args: Shift<RouterRule> ): void {
        this.#push( [ 'GET', ...args ] );
    }

    post( ...args: Shift<RouterRule> ): void {
        this.#push( [ 'POST', ...args ] );
    }

    put( ...args: Shift<RouterRule> ): void {
        this.#push( [ 'PUT', ...args ] );
    }

    head( ...args: Shift<RouterRule> ): void {
        this.#push( [ 'HEAD', ...args ] );
    }

    patch( ...args: Shift<RouterRule> ): void {
        this.#push( [ 'PATCH', ...args ] );
    }

    delete( ...args: Shift<RouterRule> ): void {
        this.#push( [ 'DELETE', ...args ] );
    }

    options( ...args: Shift<RouterRule> ): void {
        this.#push( [ 'OPTIONS', ...args ] );
    }

    any( ...args: RouterRule ): void {
        const [ methods, ...rest ] = args;

        /**
         * Uppercase the method(s) before appending in to the rules list, in order to avoid uppercasing the strings everytime in every request.
         */
        if( typeof methods === 'string' ) {
            this.#push( [ methods.toUpperCase(), ...rest ] );
            return;
        }

        this.#push( [ methods.map( m => m.toUpperCase() ), ...rest ] );
    }

    match( context: Context ): Matches | false {

        const { path, method } = context.request;
        const cacheKey = path + '\x0B' + method;

        if( this.#cache[ cacheKey ] !== undefined ) return this.#cache[ cacheKey ];

        for( const item of this.rules ) {

            const { keys = [], pattern, rule } = item;
            const [ methods ] = rule;

            if( methods !== '*' ) {
                if( typeof methods === 'string' && methods !== method ) continue;
                if( Array.isArray( methods ) && !methods.includes( method ) ) continue;
            }

            const res = match( pattern, path, keys );

            if( res === false ) continue;

            const args = res.matches.slice( 1 ); // .map( v => decodeURIComponent( v ) );

            return this.#cache[ cacheKey ] = {
                params : res.params,
                matches : args,
                rule
            };
        }

        return this.#cache[ cacheKey ] = false;
    }
}
