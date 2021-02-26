"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/ctx.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/03/2020
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ctx = void 0;
const common_1 = require("@ynn/common");
const util_1 = require("./util");
async function requestAndParameterInterceptor(metadata, ctx) {
    return common_1.runPipesInSequence(metadata.parameters.pipes, metadata.parameters.property ? ctx[metadata.parameters.property] : ctx, ctx, metadata);
}
function Ctx(...args) {
    return util_1.createGeneralDecorator({
        parameterInterceptor: requestAndParameterInterceptor,
        requestInterceptor: requestAndParameterInterceptor
    }, ...args);
}
exports.Ctx = Ctx;
