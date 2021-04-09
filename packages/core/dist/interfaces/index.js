'use strict';
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interfaces/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/15/2020
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
__exportStar( require( './pipe.interface' ), exports );
__exportStar( require( './metadata.interface' ), exports );
__exportStar( require( './logger.interface' ), exports );
