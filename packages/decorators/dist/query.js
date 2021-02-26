"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/query.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
const common_1 = require("@ynn/common");
const util_1 = require("./util");
async function requestAndParameterInterceptor(metadata, ctx) {
    return common_1.runPipesInSequence(metadata.parameters.pipes, metadata.parameters.property ? ctx.query[metadata.parameters.property] : ctx.query, ctx, metadata);
}
function Query(...args) {
    return util_1.createGeneralDecorator({
        parameterInterceptor: requestAndParameterInterceptor,
        requestInterceptor: requestAndParameterInterceptor
    }, ...args);
}
exports.Query = Query;
