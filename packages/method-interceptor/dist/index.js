'use strict';
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/20/2020
 * Description:
 ******************************************************************/
var __createBinding = this && this.__createBinding || ( Object.create ? function( o, m, k, k2 ) {
    if( k2 === undefined ) k2 = k;
    Object.defineProperty( o, k2, { enumerable : true, get : function() { return m[ k ] } } );
} : function( o, m, k, k2 ) {
    if( k2 === undefined ) k2 = k;
    o[ k2 ] = m[ k ];
} );
var __exportStar = this && this.__exportStar || function( m, exports ) {
    for( var p in m ) if( p !== 'default' && !Object.prototype.hasOwnProperty.call( exports, p ) ) __createBinding( exports, m, p );
};
Object.defineProperty( exports, '__esModule', { value : true } );
require( 'reflect-metadata' );
__exportStar( require( './storage' ), exports );
__exportStar( require( './constants' ), exports );
__exportStar( require( './metadata' ), exports );
__exportStar( require( './method.interface' ), exports );
__exportStar( require( './interceptor' ), exports );
__exportStar( require( './decorator' ), exports );
