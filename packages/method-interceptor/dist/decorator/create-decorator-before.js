"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-before.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/24/2021
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const storage_1 = __importDefault(require("../storage"));
function createDecoratorBefore(options) {
    const key = storage_1.default.key();
    const metadata = {
        type: key,
        interceptorType: 'before'
    };
    if ('parameters' in options) {
        metadata.parameters = options.parameters;
    }
    storage_1.default.set(key, options.method);
    return (target, key, descriptor) => {
        const metadatas = Reflect.getMetadata(constants_1.KEY_BEFORE, descriptor.value) || [];
        metadatas.push(metadata);
        Reflect.defineMetadata(constants_1.KEY_BEFORE, metadatas, descriptor.value);
    };
}
exports.default = createDecoratorBefore;
