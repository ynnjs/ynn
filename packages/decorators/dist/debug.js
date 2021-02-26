"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorators/debug.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/23/2021
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debug = void 0;
const util_1 = require("./util");
function Debug() {
    return util_1.createParameterDecorator((metadata, ctx) => ctx.debug);
}
exports.Debug = Debug;
