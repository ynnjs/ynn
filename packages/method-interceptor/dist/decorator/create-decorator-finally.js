'use strict';
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-finally.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/05/2021
 * Description:
 ******************************************************************/
Object.defineProperty( exports, '__esModule', { value : true } );
exports.createDecoratorFinally = void 0;
const metadata_1 = require( '../metadata' );
function createDecoratorFinally( method, options = {} ) {
    return ( target, key, descriptor ) => {
        metadata_1.saveMetadataFinally( descriptor ?? target, method, options );
    };
}
exports.createDecoratorFinally = createDecoratorFinally;
