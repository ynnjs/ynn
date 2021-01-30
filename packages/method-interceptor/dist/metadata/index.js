"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: metadata/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/30/2021
 * Description:
 ******************************************************************/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMetadataParameter = exports.saveMetadataException = exports.saveMetadataAfter = exports.saveMetadataBefore = void 0;
const constants_1 = require("../constants");
const storage_1 = require("../storage");
__exportStar(require("./metadata.interface"), exports);
function storeMethod(method) {
    const key = storage_1.Storage.key();
    storage_1.Storage.set(key, method);
    return key;
}
function saveMethodMetadata(key, descriptor, metadata) {
    const metadatas = Reflect.getMetadata(key, descriptor.value) || [];
    metadatas.push(metadata);
    Reflect.defineMetadata(key, metadatas, descriptor.value);
}
function saveMetadataBefore(descriptor, method, options = {}) {
    const metadata = {
        type: storeMethod(method),
        interceptorType: 'before'
    };
    if ('parameters' in options) {
        metadata.parameters = options.parameters;
    }
    saveMethodMetadata(constants_1.KEY_BEFORE, descriptor, metadata);
}
exports.saveMetadataBefore = saveMetadataBefore;
function saveMetadataAfter(descriptor, method, options = {}) {
    const metadata = {
        type: storeMethod(method),
        interceptorType: 'after'
    };
    if ('parameters' in options) {
        metadata.parameters = options.parameters;
    }
    saveMethodMetadata(constants_1.KEY_AFTER, descriptor, metadata);
}
exports.saveMetadataAfter = saveMetadataAfter;
function saveMetadataException(descriptor, method, options = {}) {
    const metadata = {
        type: storeMethod(method),
        interceptorType: 'exception'
    };
    if ('parameters' in options) {
        metadata.parameters = options.parameters;
    }
    if ('exceptionType' in options) {
        metadata.exceptionType = options.exceptionType;
    }
    saveMethodMetadata(constants_1.KEY_EXCEPTION, descriptor, metadata);
}
exports.saveMetadataException = saveMetadataException;
function saveMetadataParameter(target, key, i, method, options = {}) {
    const metadata = {
        type: storeMethod(method),
        interceptorType: 'parameter'
    };
    if ('parameters' in options) {
        metadata.parameters = options.parameters;
    }
    const constructor = target.constructor; // eslint-disable-line
    const metadatas = Reflect.getMetadata(constants_1.KEY_PARAMETER, constructor, key) || [];
    if (!metadatas[i])
        metadatas[i] = [metadata];
    else
        metadatas[i].push(metadata);
    Reflect.defineMetadata(constants_1.KEY_PARAMETER, metadatas, constructor, key);
}
exports.saveMetadataParameter = saveMetadataParameter;
