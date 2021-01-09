"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-interceptor-exception.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/28/2020
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const extract_1 = __importDefault(require("./extract"));
function createInterceptorException(descriptor, methods) {
    /**
     * throw the exception directly if there is no methods provided.
     */
    if (!methods)
        return (e) => { throw e; };
    const bound = extract_1.default.exception(descriptor, methods);
    return (e, ...args) => {
        for (const info of bound) {
            if (info.metadata.exceptionType === undefined || e instanceof info.metadata.type) {
                return info.method(e, info.metadata, ...args);
            }
        }
        throw e;
    };
}
exports.default = createInterceptorException;
