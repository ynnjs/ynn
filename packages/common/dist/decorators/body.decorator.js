"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/body.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/16/2020
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Body = void 0;
const interceptors_1 = require("../interceptors");
const util_1 = require("./util");
function Body(...args) {
    return util_1.createGeneralBeforeAndParameterActionDecorator({
        interceptorParameter: interceptors_1.interceptorParameterBody,
        interceptorBefore: interceptors_1.interceptorBeforeBody
    }, ...args);
}
exports.Body = Body;
