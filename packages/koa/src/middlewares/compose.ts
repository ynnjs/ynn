/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: middlewares/compose.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 09/30/2020
 * Description:
 ******************************************************************/

export type Next = ( ...args: any[] ) => any;
export type Middleware<T> = ( context: T, next: Next ) => any;
export type ComposedMiddleware<T> = ( context: T, next?: Next ) => Promise<void>;

export default function compose<T>( middleware: Middleware<T>[] ): ComposedMiddleware<T> {

    return ( ctx, next, ...args: any[] ) => {
        // last called middleware
        let index = -1;

        function dispatch( i: number ): Promise<any> {
            if( i <= index ) return Promise.reject( new Error( 'next() called multiple times' ) );
            index = i;
            const fn = i === middleware.length ? next : middleware[ i ];
            if( !fn ) return Promise.resolve();
            try {
                return Promise.resolve( fn( ctx, dispatch.bind( null, i + 1 ), ...args ) );
            } catch( e ) { return Promise.reject( e ) }
        }

        return dispatch( 0 );
    };
}
