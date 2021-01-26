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
const constants_1 = require("../constants");
const storage_1 = __importDefault(require("../storage"));
function createInterceptorParameter(constructor, methodName) {
    const bound = [];
    const metadatas = Reflect.getMetadata(constants_1.KEY_PARAMETER, constructor.prototype, methodName) || [];
    Reflect.getMetadata('design:paramtypes', constructor.prototype, methodName)?.forEach((paramtype, i) => {
        const metadata = metadatas[i];
        if (!metadata) {
            bound.push({ metadata: { paramtype } });
        }
        else {
            const method = storage_1.default.get(metadata.type);
            if (!method) {
                throw new Error(`method ${metadata.type.toString()} not exists in the method list`);
            }
            bound.push({ method, metadata: { ...metadata, paramtype } });
        }
    });
    return async (...args) => {
        const promises = [];
        bound.forEach((info) => {
            promises.push(info.method?.(info.metadata, ...args) ?? Promise.resolve(null));
        });
        return Promise.all(promises);
    };
}
exports.default = createInterceptorParameter;
