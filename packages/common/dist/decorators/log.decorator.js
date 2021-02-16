"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorators/logger.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/17/2021
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const util_1 = require("./util");
function Log() {
    return util_1.createParameterDecorator(async (metadata, ctx) => {
        return ctx.app.logger;
    });
}
exports.Log = Log;
