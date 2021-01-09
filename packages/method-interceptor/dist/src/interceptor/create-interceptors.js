"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptors.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/26/2020
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_interceptor_before_1 = __importDefault(require("./create-interceptor-before"));
const create_interceptor_after_1 = __importDefault(require("./create-interceptor-after"));
const create_interceptor_exception_1 = __importDefault(require("./create-interceptor-exception"));
const create_interceptor_parameter_1 = __importDefault(require("./create-interceptor-parameter"));
/**
 * @typeparam T - The type of arguments that would be passed to the generated interceptor methods
 * @typeparam P - The type of parameters property in metadata
 */
function createInterceptors(constructor, descriptor, methodName, options) {
    return {
        before: create_interceptor_before_1.default(descriptor, options?.methodsBefore),
        after: create_interceptor_after_1.default(descriptor, options?.methodsAfter),
        exception: create_interceptor_exception_1.default(descriptor, options?.methodsException),
        parameter: create_interceptor_parameter_1.default(constructor, methodName)
    };
}
exports.default = createInterceptors;
