"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/create-injectable-instance.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/17/2021
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInjectableInstance = void 0;
const method_interceptor_1 = require("@ynn/method-interceptor");
const fill_params_1 = require("./fill-params");
async function createInjectableInstance(constructor, // eslint-disable-line @typescript-eslint/no-explicit-any
...args) {
    const paramtypes = Reflect.getMetadata('design:paramtypes', constructor);
    if (!paramtypes || !paramtypes.length)
        return new constructor();
    const parameter = method_interceptor_1.createInterceptorParameter(constructor);
    const metadatas = method_interceptor_1.getMetadataParameter(constructor);
    const params = await fill_params_1.fillParams(await parameter(...args), metadatas, paramtypes, ...args);
    return new constructor(...params);
}
exports.createInjectableInstance = createInjectableInstance;
