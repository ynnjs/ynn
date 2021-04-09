/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/match.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/26/2021
 * Description:
 ******************************************************************/

import { Context, HttpException, Metadata, PipeFunction } from '@ynn/core';

/**
 * @example
 *
 * ```ts
 * @Action()
 * fn( @Query( 'domain', Match( /\.google\.com$/ ) ) domain: string ) {}
 * ```
 */
export function Match( pattern: string | RegExp | ( string | RegExp )[] ): PipeFunction {
    const t = typeof pattern;
    const isRegexp = pattern instanceof RegExp;

    return <T extends string | number>( value: T, ctx: Context, metadata: Metadata ): T => {

        const property = ( metadata.parameters as any )?.property; // eslint-disable-line @typescript-eslint/no-explicit-any

        const str = typeof value === 'string' ? value : String( value );

        let message = '';

        if( t === 'string' ) {
            if( pattern === str ) return value;
            message = property ? `${property} should equal to ${pattern}` : `paramater does't match ${pattern}`;
        } else if( isRegexp ) {
            if( ( pattern as RegExp ).test( str ) ) return value;
            message = property ? `${property} should match ${pattern.toString()}` : `paramater does't match ${pattern.toString()}`;
        } else {

            for( const item of pattern as ( string | RegExp )[] ) {
                if( typeof item === 'string' && item === str ) return value;
                if( item instanceof RegExp && item.test( str ) ) return value;
                message = property ? `${property} should match patterns` : 'paramater does\'t match patterns';
            }
        }

        throw new HttpException( {
            status : 400,
            message : [ message ]
        } );
    };
}
