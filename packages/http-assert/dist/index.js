"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/16/2020
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assertion = void 0;
const url_1 = require("url");
const type_is_1 = __importDefault(require("type-is"));
const statuses_1 = __importDefault(require("statuses"));
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
        this.#status = 500;
        this.#opts = {};
        this.#skip = false;
        this.#promises = [];
        this.#async = false;
        this.#required = false;
        this.#setDefault = false;
        this.set(value);
        const { status, message, opts } = settleHttpErrorArgs(...args);
        status && (this.#status = status);
        message && (this.#message = message);
        opts && (this.#opts = opts);
    }
    #status;
    #message;
    #value;
    #opts;
    #skip;
    #promises;
    #async;
    #required;
    #setDefault;
    #defaultValue;
    default(value) {
        if (!arguments.length)
            value = undefined;
        this.#defaultValue = value;
        this.#setDefault = true;
        if (!this.#value) {
            this.set(value);
            this.skip();
        }
        return this;
    }
    set(value) {
        this.#value = value;
        return this;
    }
    value() {
        if (!this.#async)
            return this.#value;
        return Promise.all(this.#promises).then(() => this.#value).catch(() => {
            this.assert(false);
        });
    }
    required(status = 400, message = statuses_1.default.message[400]) {
        this.#required = true;
        return this.assert(typeof this.#value !== 'undefined', status, message);
    }
    /**
     * alias for integer
     */
    int(transform = true, ...args) {
        return this.integer(transform, ...args);
    }
    integer(transform = true, ...args) {
        if (is_1.default.integer(this.#value)) {
            transform && (this.#value = parseInt(this.#value));
            return this.assert(true, ...args);
        }
        return this.assert(false, ...args);
    }
    number(...args) {
        return this.assert(is_1.default.number(this.#value), ...args);
    }
    url(...args) {
        try {
            new url_1.URL(this.#value);
            return this.assert(true, ...args);
        }
        catch (e) {
            return this.assert(false, ...args);
        }
    }
    date() {
    }
    /**
     * YYYY-MM-DD HH:mm:ss
     */
    time() {
    }
    dateTime(...args) {
        const date = new Date(this.#value);
        return this.assert(date.toString() !== 'Invalid Date', ...args);
    }
    timestamp() {
    }
    gt(n, ...args) {
        return this.assert(this.#value > n, ...args);
    }
    gte(n, ...args) {
        return this.assert(this.#value >= n, ...args);
    }
    lt(n, ...args) {
        return this.assert(this.#value < n, ...args);
    }
    lte(n, ...args) {
        return this.assert(this.#value <= n, ...args);
    }
    between(lower, upper, ...args) {
        return this.assert(this.#value >= lower && this.#value <= upper, ...args);
    }
    in(list, ...args) {
        return this.assert(contains(list, this.#value), ...args);
    }
    strictIn(list, ...args) {
        return this.assert(list.includes(this.#value), ...args);
    }
    notIn(list, ...args) {
        return this.assert(!contains(list, this.#value), ...args);
    }
    strictNotIn(list, ...args) {
        return this.assert(!list.includes(this.#value), ...args);
    }
    length(range, ...args) {
        const l = this.#value ? String(this.#value).length : 0;
        if (Array.isArray(range)) {
            return this.assert(l >= range[0] && l <= range[1], ...args);
        }
        return this.assert(l === range, ...args);
    }
    regex(reg, ...args) {
        return this.assert(reg.test(this.#value), ...args);
    }
    equal(x, ...args) {
        return this.assert(x == this.#value, ...args);
    }
    notEqual(x, ...args) {
        return this.assert(x != this.#value, ...args);
    }
    strictEqual(x, ...args) {
        return this.assert(x === this.#value, ...args);
    }
    notStrictEqual(x, ...args) {
        return this.assert(x !== this.#value, ...args);
    }
    deepEqual(x, ...args) {
        return this.assert(deep_equal_1.default(this.#value, x), ...args);
    }
    notDeepEqual(x, ...args) {
        return this.assert(!deep_equal_1.default(this.#value, x), ...args);
    }
    jsonstring(mutate = true, ...args) {
        if (typeof this.#value !== 'string')
            return this.assert(false, ...args);
        try {
            const json = JSON.parse(this.#value);
            mutate && this.set(json);
            return this.assert(true, ...args);
        }
        catch (e) {
            return this.assert(false, ...args);
        }
    }
    json(type = 'application/x-www-form-urlencoded', mutate = true, ...args) {
        if (type_is_1.default.is(type, 'json')) {
            return this.assert(typeof this.#value !== 'undefined', ...args);
        }
        if (typeof this.#value !== 'string')
            return this.assert(false, ...args);
        try {
            const json = JSON.parse(this.#value);
            mutate && this.set(json);
            return this.assert(true, ...args);
        }
        catch (e) {
            return this.assert(false, ...args);
        }
    }
    object(...args) {
        const v = this.#value;
        return this.assert(v && !Array.isArray(v) && typeof v === 'object', ...args);
    }
    array(...args) {
        return this.assert(this.#value && Array.isArray(this.#value), ...args);
    }
    custom(fn, ...args) {
        const res = fn.call(this, this.#value, this);
        if (typeof res.then !== 'function') {
            return this.assert(res, ...args);
        }
        this.#async = true;
        this.#promises.push(res.then((x) => { this.assert(x, ...args); }, () => { this.assert(false, ...args); }));
        return this;
    }
    skip() {
        this.#skip = true;
        return this;
    }
    assert(x, ...args) {
        if (x || this.#skip)
            return this;
        if (this.#setDefault) {
            this.set(this.#defaultValue);
            this.skip();
            return this;
        }
        if (!this.#required && typeof this.#value === 'undefined')
            return this;
        this.throw(...args);
        return this;
    }
    throw(...args) {
        const { status = this.#status, message = this.#message, opts = this.#opts } = settleHttpErrorArgs(...args);
        if (message)
            throw http_errors_1.default(status, message, opts);
        throw http_errors_1.default(status, opts);
    }
}
exports.Assertion = Assertion;
function assert(value, ...args) {
    return new Assertion(value, ...args);
}
exports.default = assert;
