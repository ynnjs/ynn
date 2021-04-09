'use strict';
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/create-abe-interceptors.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/03/2021
 * Description:
 ******************************************************************/
Object.defineProperty( exports, '__esModule', { value : true } );
exports.createABEInterceptors = void 0;
const method_interceptor_1 = require( '@ynn/method-interceptor' );
/**
 * create after, before and exception interceptors
 */
function createABEInterceptors( descriptorOrConstructor ) {
    return [
        method_interceptor_1.createInterceptorAfter( descriptorOrConstructor ),
        method_interceptor_1.createInterceptorBefore( descriptorOrConstructor ),
        method_interceptor_1.createInterceptorException( descriptorOrConstructor )
    ];
}
exports.createABEInterceptors = createABEInterceptors;
