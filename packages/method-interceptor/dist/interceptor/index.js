"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/24/2020
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInterceptorParameter = exports.createInterceptorException = exports.createInterceptorAfter = exports.createInterceptorBefore = void 0;
const create_interceptor_before_1 = __importDefault(require("./create-interceptor-before"));
exports.createInterceptorBefore = create_interceptor_before_1.default;
const create_interceptor_after_1 = __importDefault(require("./create-interceptor-after"));
exports.createInterceptorAfter = create_interceptor_after_1.default;
const create_interceptor_exception_1 = __importDefault(require("./create-interceptor-exception"));
exports.createInterceptorException = create_interceptor_exception_1.default;
const create_interceptor_parameter_1 = __importDefault(require("./create-interceptor-parameter"));
exports.createInterceptorParameter = create_interceptor_parameter_1.default;
