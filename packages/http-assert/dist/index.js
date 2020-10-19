"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/index.ts
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
var _value, _opts, _skip, _promises, _async, _required, _setDefault, _defaultValue;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assertion = void 0;
const url_1 = require("url");
const type_is_1 = __importDefault(require("type-is"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const http_errors_1 = __importDefault(require("http-errors"));
const is_1 = __importDefault(require("@lvchengbin/is"));
const contains = (list, searchElement) => {
    for (const item of list) {
        if (item == searchElement)
            return true;
    }
    return false;
};
function settleHttpErrorArgs(...args) {
    let [status, message, opts] = args;
    if (!Number.isInteger(status)) {
        opts = message;
        message = status;
        status = undefined;
    }
    if (message && typeof message !== 'string') {
        opts = message;
        message = undefined;
    }
    const res = {};
    status && (res.status = status);
    message && (res.message = message);
    opts && (res.opts = opts);
    return res;
}
class Assertion {
    constructor(value, ...args) {
        this.status = 500;
        this.message = 'Unknown Error';
        _value.set(this, void 0);
        _opts.set(this, {});
        _skip.set(this, false);
        _promises.set(this, []);
        _async.set(this, false);
        _required.set(this, false);
        _setDefault.set(this, false);
        _defaultValue.set(this, void 0);
        this.set(value);
        const { status, message, opts } = settleHttpErrorArgs(...args);
        status && (this.status = status);
        message && (this.message = message);
        opts && (__classPrivateFieldSet(this, _opts, opts));
    }
    default(value) {
        __classPrivateFieldSet(this, _defaultValue, value);
        __classPrivateFieldSet(this, _setDefault, true);
        if (!__classPrivateFieldGet(this, _value)) {
            this.set(value);
            this.skip();
        }
        return this;
    }
    set(value) {
        __classPrivateFieldSet(this, _value, value);
        return this;
    }
    value() {
        return __classPrivateFieldGet(this, _value);
    }
    required(code = 400, message = 'Bad Request') {
        __classPrivateFieldSet(this, _required, true);
        return this.assert(typeof __classPrivateFieldGet(this, _value) !== 'undefined', code, message);
    }
    /**
     * alias for integer
     */
    int(...args) {
        return this.integer(...args);
    }
    integer(...args) {
        return this.assert(is_1.default.integer(__classPrivateFieldGet(this, _value)), ...args);
    }
    number(...args) {
        return this.assert(is_1.default.number(__classPrivateFieldGet(this, _value)), ...args);
    }
    url(...args) {
        try {
            new url_1.URL(__classPrivateFieldGet(this, _value));
            return this.assert(true, ...args);
        }
        catch (e) {
            return this.assert(false, ...args);
        }
    }
    date() {
    }
    time() {
    }
    dateTime() {
    }
    timestamp() {
    }
    gt(n, ...args) {
        return this.assert(__classPrivateFieldGet(this, _value) > n, ...args);
    }
    gte(n, ...args) {
        return this.assert(__classPrivateFieldGet(this, _value) >= n, ...args);
    }
    lt(n, ...args) {
        return this.assert(__classPrivateFieldGet(this, _value) < n, ...args);
    }
    lte(n, ...args) {
        return this.assert(__classPrivateFieldGet(this, _value) <= n, ...args);
    }
    between(lower, upper, ...args) {
        return this.assert(__classPrivateFieldGet(this, _value) >= lower && __classPrivateFieldGet(this, _value) <= upper, ...args);
    }
    in(list, ...args) {
        return this.assert(contains(list, __classPrivateFieldGet(this, _value)), ...args);
    }
    strictIn(list, ...args) {
        return this.assert(list.includes(__classPrivateFieldGet(this, _value)), ...args);
    }
    notIn(list, ...args) {
        return this.assert(!contains(list, __classPrivateFieldGet(this, _value)), ...args);
    }
    strictNotIn(list, ...args) {
        return this.assert(!list.includes(__classPrivateFieldGet(this, _value)), ...args);
    }
    length(range, ...args) {
        const l = __classPrivateFieldGet(this, _value) ? String(__classPrivateFieldGet(this, _value)).length : 0;
        if (Array.isArray(range)) {
            return this.assert(l >= range[0] && l <= range[1], ...args);
        }
        return this.assert(l === range, ...args);
    }
    regex(reg, ...args) {
        return this.assert(reg.test(__classPrivateFieldGet(this, _value)), ...args);
    }
    equal(x, ...args) {
        return this.assert(x == __classPrivateFieldGet(this, _value), ...args);
    }
    notEqual(x, ...args) {
        return this.assert(x != __classPrivateFieldGet(this, _value), ...args);
    }
    strictEqual(x, ...args) {
        return this.assert(x === __classPrivateFieldGet(this, _value), ...args);
    }
    notStrictEqual(x, ...args) {
        return this.assert(x !== __classPrivateFieldGet(this, _value), ...args);
    }
    deepEqual(x, ...args) {
        return this.assert(deep_equal_1.default(__classPrivateFieldGet(this, _value), x), ...args);
    }
    notDeepEqual(x, ...args) {
        return this.assert(!deep_equal_1.default(__classPrivateFieldGet(this, _value), x), ...args);
    }
    jsonstring(mutate = true, ...args) {
        if (typeof __classPrivateFieldGet(this, _value) !== 'string')
            return this.assert(false, ...args);
        try {
            const json = JSON.parse(__classPrivateFieldGet(this, _value));
            mutate && this.set(json);
            return this.assert(true, ...args);
        }
        catch (e) {
            return this.assert(false, ...args);
        }
    }
    json(type, mutate = true, ...args) {
        if (type_is_1.default.is(type, 'json')) {
            return this.assert(typeof __classPrivateFieldGet(this, _value) !== 'undefined', ...args);
        }
        if (typeof __classPrivateFieldGet(this, _value) !== 'string')
            return this.assert(false, ...args);
        try {
            const json = JSON.parse(__classPrivateFieldGet(this, _value));
            mutate && this.set(json);
            return this.assert(true, ...args);
        }
        catch (e) {
            return this.assert(false, ...args);
        }
    }
    object(...args) {
        return this.assert(__classPrivateFieldGet(this, _value) && typeof __classPrivateFieldGet(this, _value) === 'object', ...args);
    }
    custom(fn, ...args) {
        const res = fn.call(this, __classPrivateFieldGet(this, _value), this);
        if (typeof res.then !== 'function') {
            return this.assert(res, ...args);
        }
        __classPrivateFieldSet(this, _async, true);
        __classPrivateFieldGet(this, _promises).push(res.then((x) => { this.assert(x, ...args); }, () => { this.assert(false, ...args); }));
        return this;
    }
    skip() {
        __classPrivateFieldSet(this, _skip, true);
        return this;
    }
    assert(x, ...args) {
        if (__classPrivateFieldGet(this, _skip) || x)
            return this;
        if (__classPrivateFieldGet(this, _setDefault)) {
            this.set(__classPrivateFieldGet(this, _defaultValue));
            this.skip();
            return this;
        }
        if (!__classPrivateFieldGet(this, _required) && typeof __classPrivateFieldGet(this, _value) === 'undefined')
            return this;
        this.throw(...args);
        return this;
    }
    throw(...args) {
        const { status = this.status, message = this.message, opts = __classPrivateFieldGet(this, _opts) } = settleHttpErrorArgs(...args);
        throw http_errors_1.default(status, message, opts);
    }
}
exports.Assertion = Assertion;
_value = new WeakMap(), _opts = new WeakMap(), _skip = new WeakMap(), _promises = new WeakMap(), _async = new WeakMap(), _required = new WeakMap(), _setDefault = new WeakMap(), _defaultValue = new WeakMap();
function assert(value, ...args) {
    if (arguments.length === 1 || value) {
        return new Assertion(value, ...args);
    }
    return http_errors_1.default(...args);
}
exports.default = assert;
