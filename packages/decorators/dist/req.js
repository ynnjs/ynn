"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/req.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Req = void 0;
const common_1 = require("@ynn/common");
const util_1 = require("./util");
async function requestAndParameterInterceptor(metadata, ctx) {
    return common_1.runPipesInSequence(metadata.parameters.pipes, ctx.request.req, ctx, metadata);
}
/**
 * @returns the parameter decorator or the method decorator
 */
function Req(...pipes) {
    const parameters = { pipes };
    return util_1.createDecorator({
        parameterInterceptor: requestAndParameterInterceptor,
        requestInterceptor: requestAndParameterInterceptor,
        parameters
    });
}
exports.Req = Req;
