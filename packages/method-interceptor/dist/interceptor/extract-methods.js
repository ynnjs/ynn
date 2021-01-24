"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interceptor/extract-methods.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/23/2021
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * extract all interceptor methods of a descriptor with specific key from a method pool.
 *
 * @param key - the key for metadata
 * @param descriptor - the target descriptor of the class instance method.
 * @param methods - the method pool that provides interceptor methods.
 *
 * @returns a list of information of extracted methods
 */
function extractMethods(key, descriptor, methods) {
    const bound = [];
    Reflect.getMetadata(key, descriptor.value)?.forEach((metadata) => {
        if (!Object.prototype.hasOwnProperty.call(methods, metadata.type)) {
            throw new Error(`method ${metadata.type} not exists in method list.`);
        }
        bound.push({
            method: methods[metadata.type],
            metadata
        });
    });
    return bound;
}
exports.default = extractMethods;
