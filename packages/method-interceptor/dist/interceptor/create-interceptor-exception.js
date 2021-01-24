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
const constants_1 = require("../constants");
const extract_methods_1 = __importDefault(require("./extract-methods"));
function createInterceptorException(descriptor, methods) {
    /**
     * throw the exception directly if there is no methods provided.
     */
    if (!methods) {
        return async (e, ...args) => {
            throw e;
        };
    }
    const bound = extract_methods_1.default(constants_1.KEY_EXCEPTION, descriptor, methods);
    return async (e, ...args) => {
        for (const info of bound) {
            const metadata = info.metadata;
            if (metadata.exceptionType === undefined || e instanceof metadata.exceptionType) {
                return info.method(metadata, e, ...args);
            }
        }
        throw e;
    };
}
exports.default = createInterceptorException;
