"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-before.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/26/2020
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const extract_methods_1 = __importDefault(require("./extract-methods"));
/**
 * create an empty interceptor method with methods is undefined.
 *
 * @typeparam T - the type of the arguments that will passed to the generated interceptor methods.
 *
 * @returns a `Promise` object that resolves nothing.
 */
function createInterceptorBefore(descriptor, methods) {
    if (!methods)
        return async () => Promise.resolve([]);
    const bound = extract_methods_1.default(constants_1.KEY_BEFORE, descriptor, methods);
    return async (...args) => {
        const promises = [];
        bound.forEach(info => {
            promises.push(info.method(info.metadata, ...args));
        });
        return Promise.all(promises);
    };
}
exports.default = createInterceptorBefore;
