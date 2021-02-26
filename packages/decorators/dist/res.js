"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorators/res.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/17/2021
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Res = void 0;
const common_1 = require("@ynn/common");
const util_1 = require("./util");
async function requestAndParameterInterceptor(metadata, ctx) {
    return common_1.runPipesInSequence(metadata.parameters.pipes, ctx.response.res, ctx, metadata);
}
/**
 * @returns the parameter decorator or the method decorator
 */
function Res(...pipes) {
    const parameters = { pipes };
    return util_1.createDecorator({
        parameterInterceptor: requestAndParameterInterceptor,
        requestInterceptor: requestAndParameterInterceptor,
        parameters
    });
}
exports.Res = Res;
