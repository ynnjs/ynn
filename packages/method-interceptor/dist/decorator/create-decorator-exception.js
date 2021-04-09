'use strict';
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-exception.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/26/2021
 * Description:
 ******************************************************************/
Object.defineProperty( exports, '__esModule', { value : true } );
exports.createDecoratorException = void 0;
const metadata_1 = require( '../metadata' );
function createDecoratorException( method, options = {} ) {
    return ( target, key, descriptor ) => {
        metadata_1.saveMetadataException( descriptor ?? target, method, options );
    };
}
exports.createDecoratorException = createDecoratorException;
