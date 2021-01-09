"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-after.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/27/2020
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const extract_1 = __importDefault(require("./extract"));
function createInterceptorAfter(descriptor, methods) {
    /**
     * the returns Promsie object should be resolved with the original value as default
     */
    if (!methods)
        return value => Promise.resolve(value);
    const bound = extract_1.default.after(descriptor, methods);
    return async (value, ...args) => {
        let res = await value;
        /**
         * the methods shoule be called in sequence
         */
        for (const info of bound) {
            res = await info.method(res, info.metadata, ...args); // eslint-disable-line no-await-in-loop
        }
        return res;
    };
}
exports.default = createInterceptorAfter;
