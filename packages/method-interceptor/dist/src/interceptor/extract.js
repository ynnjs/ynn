"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/extract.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/24/2020
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
/**
 * extract all interceptor methods of a descriptor with specific key from a method pool.
 *
 * @typeparam T - the type of meadata, it should be extended from Metadata interface
 * @typeparam M - the type of values for methods object.
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
        /**
         * do nothing even if methods[ metadata.type ] is not a function or is undefined.
         */
        bound.push({ method: methods[metadata.type], metadata });
    });
    return bound;
}
/**
 * extract the before interceptor
 *
 * @param descriptor - the target descriptor of the class instance method.
 * @param methods - the method pool that provides interceptor methods.
 *
 * @return a list of information of extracted methods for *BEFORE INTERCEPTOR*.
 */
function before(...args) {
    return extractMethods(constants_1.KEY_BEFORE, ...args);
}
function after(...args) {
    return extractMethods(constants_1.KEY_AFTER, ...args);
}
function exception(...args) {
    return extractMethods(constants_1.KEY_EXCEPTION, ...args);
}
function parameter(constructor, methodName, methods) {
    const bound = [];
    /**
     * get metadata for PARAMETER INTERCEPTOR of given method.
     */
    const metadatas = Reflect.getMetadata(constants_1.KEY_PARAMETER, constructor.prototype, methodName) || [];
    /**
     * get the parameters metadata which is generated by typescript automatically
     */
    Reflect.getMetadata('design:paramtypes', constructor.prototype, methodName).forEach((paramtype, i) => {
        /**
         * combine paramtypes and metadatas for interceptor.
         */
        const metadata = metadatas[i] || {};
        bound.push({
            method: methods[metadata.type],
            metadata: {
                ...metadata,
                paramtype
            }
        });
    });
    return bound;
}
exports.default = { before, after, exception, parameter };
