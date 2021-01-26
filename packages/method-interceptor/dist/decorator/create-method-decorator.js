"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-method-decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/26/2021
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = __importDefault(require("../storage"));
function createMethodDecorator(key, interceptorType, options) {
    const type = storage_1.default.key();
    const metadata = { type, interceptorType };
    if ('parameters' in options) {
        metadata.parameters = options.parameters;
    }
    storage_1.default.set(type, options.method);
    return (target, k, descriptor) => {
        const metadatas = Reflect.getMetadata(key, descriptor.value) || [];
        metadatas.push(metadata);
        Reflect.defineMetadata(key, metadatas, descriptor.value);
    };
}
exports.default = createMethodDecorator;
