"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/debug.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/16/2020
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _call, _enabled, _levels, _styles;
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const cli_style_1 = __importDefault(require("cli-style"));
const styles = {
    log: { color: 'white' },
    error: { color: 'red' },
    warn: { color: 'orange' },
    debug: { color: 'cyan' },
    verbose: { color: 'blue' }
};
class DebugLogger {
    constructor(options = {}) {
        _call.set(this, (name, style, msg, ...args) => {
            if (!__classPrivateFieldGet(this, _enabled).call(this, name))
                return;
            return DebugLogger[name](style, msg, ...args);
        });
        _enabled.set(this, (name) => {
            if (__classPrivateFieldGet(this, _levels) === false)
                return false;
            if (__classPrivateFieldGet(this, _levels) === true)
                return true;
            return __classPrivateFieldGet(this, _levels).includes(name);
        });
        _levels.set(this, true);
        _styles.set(this, { ...styles });
        if (typeof options.levels !== 'undefined') {
            __classPrivateFieldSet(this, _levels, options.levels);
        }
        if (options.styles === false) {
            __classPrivateFieldSet(this, _styles, false);
        }
        else {
            __classPrivateFieldSet(this, _styles, {
                ...__classPrivateFieldGet(this, _styles),
                ...options.styles
            });
        }
    }
    log(msg, ...args) {
        __classPrivateFieldGet(this, _call).call(this, 'log', __classPrivateFieldGet(this, _styles) && __classPrivateFieldGet(this, _styles)?.log, msg, ...args);
    }
    error(msg, ...args) {
        __classPrivateFieldGet(this, _call).call(this, 'error', __classPrivateFieldGet(this, _styles) && __classPrivateFieldGet(this, _styles)?.error, msg, ...args);
    }
    warn(msg, ...args) {
        __classPrivateFieldGet(this, _call).call(this, 'warn', __classPrivateFieldGet(this, _styles) && __classPrivateFieldGet(this, _styles)?.warn, msg, ...args);
    }
    debug(msg, ...args) {
        __classPrivateFieldGet(this, _call).call(this, 'debug', __classPrivateFieldGet(this, _styles) && __classPrivateFieldGet(this, _styles)?.debug, msg, ...args);
    }
    verbose(msg, ...args) {
        __classPrivateFieldGet(this, _call).call(this, 'verbose', __classPrivateFieldGet(this, _styles) && __classPrivateFieldGet(this, _styles)?.verbose, msg, ...args);
    }
    static log(style, msg, ...args) {
        this.print(style && { ...styles.log, ...style }, msg, ...args);
    }
    static error(style, msg, ...args) {
        this.print(style && { ...styles.error, ...style }, msg, ...args);
    }
    static warn(style, msg, ...args) {
        this.print(style && { ...styles.warn, ...style }, msg, ...args);
    }
    static debug(style, msg, ...args) {
        this.print(style && { ...styles.debug, ...style }, msg, ...args);
    }
    static verbose(style, msg, ...args) {
        this.print(style && { ...styles.verbose, ...style }, msg, ...args);
    }
    static print(style, msg, ...args) {
        process.stdout.write(cli_style_1.default(util_1.default.format(msg, ...args) + '\n', style));
    }
}
exports.default = DebugLogger;
_call = new WeakMap(), _enabled = new WeakMap(), _levels = new WeakMap(), _styles = new WeakMap();
