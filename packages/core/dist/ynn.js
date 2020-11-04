"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/ynn.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/26/2020
 * Description:
 ******************************************************************/
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _address, _configs, _logger, _options, _setup;
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("@ynn/koa"));
const cargs_1 = __importDefault(require("./cargs"));
const debug_1 = __importDefault(require("./debug"));
const logger_proxy_1 = __importDefault(require("./logger-proxy"));
class Ynn extends koa_1.default {
    constructor(options = {}) {
        super();
        this.server = null;
        _address.set(this, null);
        _configs.set(this, []);
        _logger.set(this, (options) => {
            const { logger, logging = false, debugging = true } = options;
            this.logger = logger_proxy_1.default({
                debug: this.debug,
                logging, debugging, logger
            });
        });
        _options.set(this, void 0);
        _setup.set(this, (options) => {
            __classPrivateFieldSet(this, _options, { ...options, ...cargs_1.default });
            __classPrivateFieldGet(this, _logger).call(this, __classPrivateFieldGet(this, _options));
        });
        this.debug = new debug_1.default(options.debugOptions || {});
        __classPrivateFieldGet(this, _setup).call(this, options);
    }
    listen(...args) {
        if (__classPrivateFieldGet(this, _options).port) {
            if (Number.isInteger(args[0])) {
                args[0] = __classPrivateFieldGet(this, _options).port;
            }
            else {
                args.unshift(__classPrivateFieldGet(this, _options).port);
            }
        }
        this.server = super.listen(...args);
        __classPrivateFieldSet(this, _address, this.server.address());
        this.debug.log(`Server is running on port ${__classPrivateFieldGet(this, _address).port}`);
        return this.server;
    }
    summary() {
        return {
            'log-path': __classPrivateFieldGet(this, _options)['log-path'],
            port: __classPrivateFieldGet(this, _address)?.port ?? null
        };
    }
    config(path, defaultValue) {
        let res;
        for (const config of __classPrivateFieldGet(this, _configs)) {
            res = config.get(path);
            if (res !== undefined)
                return res;
        }
        return res === undefined ? defaultValue : res;
    }
}
exports.default = Ynn;
_address = new WeakMap(), _configs = new WeakMap(), _logger = new WeakMap(), _options = new WeakMap(), _setup = new WeakMap();
Ynn.cargs = cargs_1.default;
