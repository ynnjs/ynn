"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptor/create-interceptor-parameter.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/05/2021
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const extract_1 = __importDefault(require("./extract"));
function createInterceptorParameter(constructor, methodName, methods) {
    const bound = extract_1.default.parameter(constructor, methodName, methods);
    return async (...args) => {
        const promises = [];
        bound.forEach((info) => {
            promises.push(info.method(info.metadata, ...args));
        });
        return Promise.all(promises);
    };
}
exports.default = createInterceptorParameter;
