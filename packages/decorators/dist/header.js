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
const common_1 = require("@ynn/common");
const util_1 = require("./util");
async function responseInterceptor(metadata, response, ctx) {
    metadata.parameters.headers.forEach(pair => {
        ctx.set(...pair);
    });
    return response;
}
async function requestAndParameterInterceptor(metadata, ctx) {
    return common_1.runPipesInSequence(metadata.parameters.pipes, metadata.parameters.property ? ctx.get(metadata.parameters.property) : ctx.headers, ctx, metadata);
}
function Header(...args) {
    const [propertyOrPipeOrHeaders, pipeOrValue] = args;
    const t1 = typeof propertyOrPipeOrHeaders;
    const t2 = typeof pipeOrValue;
    /**
     * Method decorator for action method.
     * Setting header(s) to the response data
     */
    if ((t1 === 'string' && t2 === 'string') || (args.length === 1 && t1 !== 'function' && t1 !== 'string')) {
        const headers = [];
        if (t1 === 'string') {
            headers.push([propertyOrPipeOrHeaders, pipeOrValue]);
        }
        else {
            Object.keys(propertyOrPipeOrHeaders).forEach(key => {
                headers.push([key, propertyOrPipeOrHeaders[key]]);
            });
        }
        return util_1.createResponseDecorator(responseInterceptor, { headers });
    }
    return util_1.createGeneralDecorator({
        parameterInterceptor: requestAndParameterInterceptor,
        requestInterceptor: requestAndParameterInterceptor
    }, ...args);
}
exports.Header = Header;
