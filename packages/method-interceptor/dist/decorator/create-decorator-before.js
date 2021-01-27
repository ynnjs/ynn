"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-before.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/24/2021
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDecoratorBefore = void 0;
const constants_1 = require("../constants");
const create_method_decorator_1 = __importDefault(require("./create-method-decorator"));
function createDecoratorBefore(options) {
    return create_method_decorator_1.default(constants_1.KEY_BEFORE, 'before', options);
}
exports.createDecoratorBefore = createDecoratorBefore;
