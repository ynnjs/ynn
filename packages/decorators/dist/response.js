"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/response.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
const common_1 = require("@ynn/common");
const util_1 = require("./util");
;
function Response(data, ...pipes) {
    if (typeof data === 'function') {
        pipes.unshift(data);
        data = undefined;
    }
    const parameters = { data, pipes };
    return util_1.createDecorator({
        responseInterceptor: async (metadata, value, ctx) => {
            const parameters = metadata.parameters;
            return common_1.runPipesInSequence(parameters.pipes, parameters.data === undefined ? value : parameters.data, ctx, metadata);
        },
        parameters
    });
}
exports.Response = Response;
