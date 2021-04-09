'use strict';
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/module.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 03/28/2021
 * Description:
 ******************************************************************/
Object.defineProperty( exports, '__esModule', { value : true } );
exports.getModuleMetadata = exports.Module = void 0;
require( 'reflect-metadata' );
const constants_1 = require( './constants' );
function Module( options = {} ) {
    return ( target ) => {
        Reflect.defineMetadata( constants_1.MODULE_METADATA_KEY, options, target );
    };
}
exports.Module = Module;
function getModuleMetadata( target ) {
    return Reflect.getMetadata( constants_1.MODULE_METADATA_KEY, target );
}
exports.getModuleMetadata = getModuleMetadata;
