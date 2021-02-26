"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/optional.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/24/2021
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Optional = void 0;
const util_1 = require("./util");
function Optional(defaultValue) {
    return util_1.createParameterDecorator((metadata, ctx, val) => {
        if (val === undefined || val === null)
            return defaultValue ?? val;
        return val;
    });
}
exports.Optional = Optional;
