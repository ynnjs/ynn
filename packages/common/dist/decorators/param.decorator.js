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
function Param(...args) {
    return util_1.createActionDecorator('param', ...args);
}
exports.Param = Param;
