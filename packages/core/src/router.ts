/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/router.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/01/2020
 * Description: 
 ******************************************************************/

import util from 'util';
import { pathToRegexp } from 'path-to-regexp';
import Koa, { compose, Middleware } from '@ynn/koa';

export type Path = string | RegExp | Array<string | RegExp>;
export type Handler = Middleware | Middleware[];
export type Method = ( path: Path, fn: Handler ) => Koa | Middleware;

export interface Router {
    app?: Koa;
}

const isRegExp = util.types.isRegExp;

function match( path: string | RegExp, ctx, options ): false | string[] {
    if( isRegExp( path ) ) {
        const matches = ctx.path.match( path );
        matches.groups && ( ctx.params = matches.groups );
        return matches;
    }
    const keys = [];
    const matches = pathToRegexp( path, keys, options ).exec( ctx.path );

    if( matches ) {
        for( let i = 0, l = keys.length; i < l; i += 1 ) {
            const { name } = keys[ i ]; 
            ctx.params[ name ] = matches[ i + 1 ];
        }
        return matches;
    }

    return false;
}

function execute( this: Router, ctx, next, path, fn, options: any = {} ): Promise<any> {

    ctx.params ||= {};
    let matches: false | string[] = false;

    if( Array.isArray( path ) ) {
        for( const item of path ) {
            matches = match( item, ctx, options );
            if( matches ) break;
        }
    } else {
        matches = match( path, ctx, options );
    }

    if( !matches ) return next();

    const args = matches.slice( 1 ).map( v => decodeURIComponent( v ) );
    ctx.routerMatches = args;
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

    constructor( public app?: Koa ) {
        this.get = createMethod.call( this, 'get' );
        this.put = createMethod.call( this, 'put' );
        this.head = createMethod.call( this, 'head' );
        this.post = createMethod.call( this, 'post' );
        this.patch = createMethod.call( this, 'patch' );
        this.delete = createMethod.call( this, 'delete' );
        this.options = createMethod.call( this, 'options' );
    }

    any( methods: string | string[], ...args: Parameters<Method> ): ReturnType<Method> {
        if( Array.isArray( args[ 1 ] ) ) args[ 1 ] = compose( args[ 1 ] );

        const func = ( ctx, next ): Promise<any> => {
            if( methods !== '*' && !methods.includes( ctx.method ) ) return next();
            return execute.call( this, ctx, next, ...args );
        }
        return this.app ? this.app.use( func ) : func;
    }
}
