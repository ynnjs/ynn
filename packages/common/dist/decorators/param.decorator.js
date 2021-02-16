"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/param.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Param = void 0;
const util_1 = require("./util");
async function requestAndParameterInterceptor(metadata, ctx) {
    return util_1.executePipes(metadata.parameters.pipes, ctx, 
    // metadata.parameters.property ? ctx.params[ metadata.parameters.property ] : ctx.params,
    ctx);
}
function Param(...args) {
    return util_1.createGeneralDecorator({
        parameterInterceptor: requestAndParameterInterceptor,
        requestInterceptor: requestAndParameterInterceptor
    }, ...args);
}
exports.Param = Param;
