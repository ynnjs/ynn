"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorators/exception.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/17/2021
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exception = void 0;
const common_1 = require("@ynn/common");
const util_1 = require("./util");
function Exception(...pipes) {
    const parameters = {
        pipes: [...pipes]
    };
    return util_1.createExceptionDecorator(async (metadata, e, ctx) => {
        return common_1.runPipesInSequence(parameters.pipes, e, ctx, metadata);
    }, parameters);
}
exports.Exception = Exception;
