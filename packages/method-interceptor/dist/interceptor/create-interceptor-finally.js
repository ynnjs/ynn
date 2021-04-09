'use strict';
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptor/create-interceptor-finally.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/05/2021
 * Description:
 ******************************************************************/
var __importDefault = this && this.__importDefault || function( mod ) {
    return mod && mod.__esModule ? mod : { 'default' : mod };
};
Object.defineProperty( exports, '__esModule', { value : true } );
exports.createInterceptorFinally = void 0;
const constants_1 = require( '../constants' );
const extract_methods_1 = __importDefault( require( './extract-methods' ) );
/**
 * @typeparam T
 *
 * @param descriptorOrConstructor
 */
function createInterceptorFinally( descriptorOrConstructor ) {
    const bound = extract_methods_1.default( constants_1.KEY_FINALLY, descriptorOrConstructor );
    return async ( ...args ) => {
        const promises = [];
        bound.forEach( info => {
            promises.push( info.method( info.metadata, ...args ) );
        } );
        return Promise.all( promises );
    };
}
exports.createInterceptorFinally = createInterceptorFinally;
