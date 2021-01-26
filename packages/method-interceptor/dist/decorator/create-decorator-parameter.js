"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-parameter.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/26/2021
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = __importDefault(require("../storage"));
const constants_1 = __importDefault(require("../constants"));
function createDecoratorParameter(options) {
    const type = storage_1.default.key();
    const metadata = { type, interceptorType: 'parameter' };
    if ('parameters' in options) {
        metadata.parameters = options.parameters;
    }
    storage_1.default.set(type, options.method);
    return (target, key, i) => {
        const metadatas = Reflect.getMetadata(constants_1.default, target.constructor, key) || [];
        metadatas[i] = metadata;
        Reflect.defineMetadata(constants_1.default, metadatas, target.constructor, key);
    };
}
exports.default = createDecoratorParameter;
