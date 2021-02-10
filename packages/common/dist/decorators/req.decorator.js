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
const util_1 = require("./util");
function Req(...args) {
    return util_1.createActionDecorator('req', ...args);
}
exports.Req = Req;
