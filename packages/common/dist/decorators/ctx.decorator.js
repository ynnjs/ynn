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
const util_1 = require("./util");
function Ctx(...args) {
    return util_1.createActionDecorator('ctx', ...args);
}
exports.Ctx = Ctx;
