"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/create-injectable-instance.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/17/2021
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const method_interceptor_1 = require("@ynn/method-interceptor");
const fill_params_1 = __importDefault(require("./fill-params"));
async function createInjectableInstance(constructor, ...args) {
    const paramtypes = Reflect.getMetadata('design:paramtypes', constructor);
    if (!paramtypes || !paramtypes.length)
        return new constructor();
    const parameter = method_interceptor_1.createInterceptorParameter(constructor);
    const metadatas = method_interceptor_1.getMetadataParameter(constructor);
    const params = await fill_params_1.default(await parameter(...args), metadatas, paramtypes, ...args);
    return new constructor(...params);
}
exports.default = createInjectableInstance;
