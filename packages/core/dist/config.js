"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/config.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/27/2020
 * Description:
 ******************************************************************/
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _cache, _config;
Object.defineProperty(exports, "__esModule", { value: true });
class Config {
    constructor(config) {
        _cache.set(this, new Map());
        _config.set(this, void 0);
        if (config instanceof Config)
            return config;
        __classPrivateFieldSet(this, _config, config);
    }
    get(path, defaultValue) {
        if (!arguments.length)
            return __classPrivateFieldGet(this, _config);
        const cache = __classPrivateFieldGet(this, _cache);
        if (cache.has(path)) {
            const exists = cache.get(path);
            return typeof exists === 'undefined' ? defaultValue : exists;
        }
        let tmp = __classPrivateFieldGet(this, _config);
        for (const item of path.split('.')) {
            tmp = tmp?.[item];
            if (typeof tmp === 'undefined')
                break;
        }
        cache.set(path, tmp);
        if (typeof tmp === 'undefined')
            return defaultValue;
        return tmp;
    }
}
exports.default = Config;
_cache = new WeakMap(), _config = new WeakMap();
