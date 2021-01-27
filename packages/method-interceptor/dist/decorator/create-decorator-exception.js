"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-exception.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/26/2021
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDecoratorException = void 0;
const constants_1 = require("../constants");
const create_method_decorator_1 = __importDefault(require("./create-method-decorator"));
function createDecoratorException(options) {
    return create_method_decorator_1.default(constants_1.KEY_EXCEPTION, 'exception', options);
}
exports.createDecoratorException = createDecoratorException;
