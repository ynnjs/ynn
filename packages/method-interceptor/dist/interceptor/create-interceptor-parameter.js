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
    const metadatas = Reflect.getMetadata(constants_1.KEY_PARAMETER, constructor, methodName) || [];
    Reflect.getMetadata('design:paramtypes', constructor.prototype, methodName)?.forEach((paramtype, i) => {
        const metadata = metadatas[i];
        if (!metadata) {
            bound.push([{ metadata: { paramtype } }]);
        }
        else {
            const mds = [];
            /**
             * added paramtype property to each metadata object
             */
            metadata.forEach(m => {
                const method = storage_1.default.get(m.type);
                if (!method) {
                    throw new Error(`method ${m.type.toString()} not exists in the method list`);
                }
                mds.push({ method, metadata: { ...m, paramtype } });
            });
            bound.push(mds);
        }
    });
    return async (...args) => {
        const promises = [];
        bound.forEach((metadata) => {
            if (!metadata.length) {
                promises.push(Promise.resolve(null));
                return;
            }
            const last = metadata[metadata.length - 1];
            let promise = Promise.resolve(last.method?.(last.metadata, ...args) ?? null);
            for (let i = metadata.length - 2; i >= 0; i -= 1) {
                const item = metadata[i];
                promise = promise.then(() => {
                    return item.method?.(item.metadata, ...args) ?? null;
                });
            }
            promises.push(promise);
        });
        return Promise.all(promises);
    };
}
exports.default = createInterceptorParameter;
