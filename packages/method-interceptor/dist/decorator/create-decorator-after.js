"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-after.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/26/2021
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDecoratorAfter = void 0;
const constants_1 = require("../constants");
const create_method_decorator_1 = __importDefault(require("./create-method-decorator"));
function createDecoratorAfter(method, options = {}) {
    return create_method_decorator_1.default(constants_1.KEY_AFTER, 'after', method, options);
}
exports.createDecoratorAfter = createDecoratorAfter;
