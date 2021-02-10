"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/status.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/16/2020
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
const util_1 = require("./util");
function Status(statusCode, message) {
    return util_1.createActionResponseDecorator('status', { statusCode, message });
}
exports.Status = Status;
