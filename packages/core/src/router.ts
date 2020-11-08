/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/router.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/01/2020
 * Description: 
 ******************************************************************/

import { pathToRegexp, Key } from 'path-to-regexp';
import Koa, { compose, KoaMiddleware } from '@ynn/koa';

export type Path = string | RegExp | Array<string | RegExp>;
export type Handler = KoaMiddleware | KoaMiddleware[];
export type Method = ( path: Path, fn: Handler ) => Koa | KoaMiddleware;

export interface Router {
    app?: Koa;
}

function match( rule: string | RegExp | Array<string |RegExp>, path: string, options = {} ): false | {
    params: Record<string, string>,
    matches: string[]
} {
    const keys: Key[] = [];
    const matches = pathToRegexp( rule, keys, options ).exec( path );

    if( !matches ) return false;

    const params = {};

    keys.forEach( ( key: Key, i: number ) => {
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

function execute( this: Router, ctx, next, rule, fn, options: any = {} ): Promise<any> {

    const res = match( rule, ctx.path, options );

    if( res === false ) {
        ctx.params = {};
        ctx.routerMatches = [];
        return next();
    }

    const args = res.matches.slice( 1 ).map( v => decodeURIComponent( v ) );
    ctx.routerMatches = args;
    ctx.params = res.params;
    return Promise.resolve( fn.call( this.app, ctx, next, ...args ) );
}

function createMethod( this: Router, method: string ): Method {
    return ( path, fn, options = {} ) => {
        if( Array.isArray( fn ) ) fn = compose( fn );

        const func = ( ctx, next ): Promise<any> => {
            if( method !== ctx.method ) return next();
            return execute.call( this, ctx, next, path, fn, options );
        }

        return this.app ? this.app.use( func ) : func;
    }
}

export default class implements Router {

    get: Method;
    put: Method;
    head: Method;
    post: Method;
    patch: Method;
    delete: Method;
    options: Method;

    static match = match;

    constructor( public app?: Koa ) {
        this.get = createMethod.call( this, 'GET' );
        this.put = createMethod.call( this, 'PUT' );
        this.head = createMethod.call( this, 'HEAD' );
        this.post = createMethod.call( this, 'POST' );
        this.patch = createMethod.call( this, 'PATCH' );
        this.delete = createMethod.call( this, 'DELETE' );
        this.options = createMethod.call( this, 'OPTIONS' );
    }

    any( methods: string | string[], ...args: Parameters<Method> ): ReturnType<Method> {

        /**
         * compose all middlwares if the third argument is a list of middleware function
         */
        if( Array.isArray( args[ 1 ] ) ) args[ 1 ] = compose( args[ 1 ] );

        /**
         * the first argument should be case insensitive.
         * to uppercase all strings for try matching ctx.method.
         */
        if( Array.isArray( methods ) ) {
            methods = methods.map( ( method: string ): string => method.toUpperCase() );
        } else {
            methods = methods.toUpperCase();
        }

        const func = ( ctx, next ): Promise<any> => {
            methodCheck: {
                if( methods === '*' ) break methodCheck;
                if( typeof methods === 'string' && methods !== ctx.method ) return next();
                if( Array.isArray( methods ) && !methods.includes( ctx.method ) ) return next();
            }
            return execute.call( this, ctx, next, ...args );
        }
        return this.app ? this.app.use( func ) : func;
    }
}
