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
const is_1 = __importDefault(require("@lvchengbin/is"));
const create_injectable_instance_1 = __importDefault(require("./create-injectable-instance"));
async function fillParams(params, metadatas, paramtypes, ...args) {
    for (let i = 0, l = params.length; i < l; i += 1) {
        if (metadatas[i] === undefined && is_1.default.class(paramtypes[i])) {
            params[i] = await create_injectable_instance_1.default(paramtypes[i], ...args); // eslint-disable-line no-await-in-loop
        }
    }
    return params;
}
exports.default = fillParams;
