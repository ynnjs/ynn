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
const constants_1 = require("../constants");
const extract_methods_1 = __importDefault(require("./extract-methods"));
/**
 * @typeparam T
 * @typeparam V
 *
 * @returns
 */
function createInterceptorAfter(descriptor) {
    const bound = extract_methods_1.default(constants_1.KEY_AFTER, descriptor);
    return async (value, ...args) => {
        let res = await Promise.resolve(value);
        /**
         * the methods shoule be called in sequence
         */
        for (const info of bound) {
            res = await info.method(info.metadata, res, ...args); // eslint-disable-line no-await-in-loop
        }
        return res;
    };
}
exports.default = createInterceptorAfter;
