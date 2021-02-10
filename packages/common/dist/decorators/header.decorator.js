"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/header.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/09/2020
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = void 0;
const method_interceptor_1 = require("@ynn/method-interceptor");
const interceptors_1 = require("../interceptors");
const util_1 = require("./util");
function Header(...args) {
    const [propertyOrPipeOrHeaders, pipeOrValue] = args;
    const t1 = typeof propertyOrPipeOrHeaders;
    const t2 = typeof pipeOrValue;
    /**
     * Method decorator for action method.
     * Setting header(s) to the response data
     */
    if ((t1 === 'string' && t2 === 'string') || (propertyOrPipeOrHeaders && t1 === 'object')) {
        const headers = [];
        if (t1 === 'string') {
            headers.push([propertyOrPipeOrHeaders, pipeOrValue]);
        }
        else {
            Object.keys(propertyOrPipeOrHeaders).forEach(key => {
                headers.push([key, propertyOrPipeOrHeaders[key]]);
            });
        }
        return method_interceptor_1.createDecoratorAfter(interceptors_1.interceptorAfterHeader, { headers });
    }
    return util_1.createGeneralBeforeAndParameterActionDecorator({
        interceptorParameter: interceptors_1.interceptorParameterHeader,
        interceptorBefore: interceptors_1.interceptorBeforeHeader
    }, ...args);
}
exports.Header = Header;
