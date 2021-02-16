"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/request.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const util_1 = require("./util");
async function requestAndParameterInterceptor(metadata, ctx) {
    return util_1.executePipes(metadata.parameters.pipes, metadata.parameters.property ? ctx.request[metadata.parameters.property] : ctx.request, ctx);
}
function Request(...args) {
    return util_1.createGeneralDecorator({
        parameterInterceptor: requestAndParameterInterceptor,
        requestInterceptor: requestAndParameterInterceptor
    }, ...args);
}
exports.Request = Request;
