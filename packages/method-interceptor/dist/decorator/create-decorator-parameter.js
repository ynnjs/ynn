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
exports.createDecoratorParameter = void 0;
const storage_1 = __importDefault(require("../storage"));
const constants_1 = require("../constants");
function createDecoratorParameter(options) {
    const type = storage_1.default.key();
    const metadata = { type, interceptorType: 'parameter' };
    if ('parameters' in options) {
        metadata.parameters = options.parameters;
    }
    storage_1.default.set(type, options.method);
    return (target, key, i) => {
        const metadatas = Reflect.getMetadata(constants_1.KEY_PARAMETER, target.constructor, key) || [];
        if (!metadatas[i]) {
            metadatas[i] = [];
        }
        metadatas[i].push(metadata);
        Reflect.defineMetadata(constants_1.KEY_PARAMETER, metadatas, target.constructor, key);
    };
}
exports.createDecoratorParameter = createDecoratorParameter;
