"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptor/extract-methods.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/23/2021
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = __importDefault(require("../storage"));
/**
 * extract all interceptor methods of a descriptor with specific key from a method pool.
 *
 * @param key - the key for metadata
 * @param descriptor - the target descriptor of the class instance method.
 *
 * @returns a list of information of extracted methods
 */
function extractMethods(key, descriptor) {
    const bound = [];
    Reflect.getMetadata(key, descriptor.value)?.forEach((metadata) => {
        const method = storage_1.default.get(metadata.type);
        if (!method) {
            throw new Error(`method ${metadata.type.toString()} not exists in method list.`);
        }
        bound.push({ method, metadata });
    });
    return bound;
}
exports.default = extractMethods;
