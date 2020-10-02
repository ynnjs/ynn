/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: middlewares/compose.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/02/2020
 * Description: 
 ******************************************************************/

import Benchmark from 'benchmark';
import compose, { Next } from '../../src/middlewares/compose';


const suite = new Benchmark.Suite( '@ynn/koa/compose', { delay : 100 } );

suite.add( 'compose', () => {

    const logic = () => Promise.resolve( true );

    const fn = ( ctx: Record<string, any> , next: Next ) => {
        return logic().then( next ).then( logic );
    }

    for( let exp = 0; exp <= 10; exp += 1 ) {
        const count = Math.pow( 2, exp );
        const arr = [];
        for( let i = 0; i < count; i += 1 ) {
            arr.push( fn );
        }
        const stack = compose( arr );
        return stack( {} );
    }
} ).on( 'complete', function( this: Benchmark.Suite ) {
    console.log( this.filter( 'fastest' ).map( 'name' ) );
} ).run( { 'async' : true } );
