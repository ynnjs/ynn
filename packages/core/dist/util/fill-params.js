"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/fill-params.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/17/2021
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fillParams = void 0;
const is_1 = __importDefault(require("@lvchengbin/is"));
const create_injectable_instance_1 = require("./create-injectable-instance");
async function fillParams(params, metadatas, paramtypes, ...args) {
    for (let i = 0, l = params.length; i < l; i += 1) {
        if (metadatas[i] === undefined && is_1.default.class(paramtypes[i])) {
            params[i] = await create_injectable_instance_1.createInjectableInstance(paramtypes[i], ...args); // eslint-disable-line no-await-in-loop
        }
    }
    return params;
}
exports.fillParams = fillParams;
