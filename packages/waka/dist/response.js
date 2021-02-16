"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/response.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/09/2021
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
var _headers, _body;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
const util_1 = __importDefault(require("util"));
const assert_1 = __importDefault(require("assert"));
const stream_1 = __importDefault(require("stream"));
const path_1 = require("path");
const type_is_1 = require("type-is");
const statuses_1 = __importDefault(require("statuses"));
const encodeurl_1 = __importDefault(require("encodeurl"));
const escape_html_1 = __importDefault(require("escape-html"));
const cache_content_type_1 = __importDefault(require("cache-content-type"));
const content_disposition_1 = __importDefault(require("content-disposition"));
class Response {
    constructor(options) {
        _headers.set(this, new Map());
        _body.set(this, null);
        this.statusCode = 200;
        this.EXPLICIT_STATUS = false;
        this.EXPLICIT_NULL_BODY = false;
        const { res } = options;
        this.ctx = options.ctx;
        options.statusCode && (this.statusCode = options.statusCode);
        const { headers } = options;
        headers && Object.keys(headers).forEach((name) => {
            this.set(name, headers[name]);
        });
        this.statusMessage = options.statusMessage === undefined ? (statuses_1.default.message[this.statusCode] ?? '') : options.statusMessage;
        if (res) {
            this.res = options.res;
            options.headers ?? (this.headers = res.getHeaders());
            options.statusCode ?? (this.statusCode = res.statusCode);
            options.statusMessage ?? (this.message = res.statusMessage);
        }
    }
    get socket() {
        return this.res?.socket ?? null;
    }
    /**
     * Get all set response headers
     */
    get headers() {
        return Object.fromEntries(__classPrivateFieldGet(this, _headers));
    }
    /**
     * Set response headers
     */
    set headers(headers) {
        __classPrivateFieldGet(this, _headers).clear();
        Object.keys(headers).forEach((name) => {
            this.set(name, headers[name]);
        });
    }
    /**
     * Get response status code
     */
    get status() {
        return this.statusCode;
    }
    /**
     * Set response status code
     */
    set status(code) {
        if (this.headerSent)
            return;
        assert_1.default(Number.isInteger(code), 'status code must be an integer');
        assert_1.default(code >= 100 && code < 999, `incalid status code: ${code}`);
        this.EXPLICIT_STATUS = true;
        this.statusCode = code;
        this.statusMessage = statuses_1.default.message[code] ?? '';
        if (this.body && statuses_1.default.empty[code])
            this.body = null;
    }
    /**
     * Get response status message
     */
    get message() {
        return this.statusMessage;
    }
    /**
     * Set response status message
     */
    set message(msg) {
        this.statusMessage = msg;
    }
    /**
     * Get response body
     */
    get body() {
        return __classPrivateFieldGet(this, _body);
    }
    /**
     * Set response body
     */
    set body(val) {
        const original = __classPrivateFieldGet(this, _body);
        __classPrivateFieldSet(this, _body, val);
        if (val === null) {
            if (!statuses_1.default.empty[this.status])
                this.status = 204;
            this.EXPLICIT_NULL_BODY = true;
            this.remove('Content-Type');
            this.remove('Content-Length');
            this.remove('Transfer-Encoding');
            return;
        }
        if (!this.EXPLICIT_STATUS)
            this.status = 200;
        const setType = !this.has('Content-Type');
        if (typeof val === 'string') {
            if (setType)
                this.type = /^\s*</.test(val) ? 'html' : 'text';
            this.length = Buffer.byteLength(val);
            return;
        }
        if (Buffer.isBuffer(val)) {
            if (setType)
                this.type = 'bin';
            this.length = val.length;
            return;
        }
        if (val instanceof stream_1.default) {
            if (original !== null) {
                this.remove('Content-Length');
            }
            if (setType)
                this.type = 'bin';
            return;
        }
        this.remove('Content-Length');
        this.type = 'json';
    }
    /**
     * Set Content-Length field to n
     */
    set length(n) {
        this.set('Content-Length', n?.toString() ?? undefined);
    }
    /**
     * Return parsed response Content-Length when present.
     */
    get length() {
        if (this.has('Content-Length')) {
            return parseInt(this.get('Content-Length'), 10) || 0;
        }
        const { body } = this;
        if (!body || body instanceof stream_1.default)
            return undefined;
        if (typeof body === 'string')
            return Buffer.byteLength(body);
        if (Buffer.isBuffer(body))
            return body.length;
        return Buffer.byteLength(JSON.stringify(body));
    }
    /**
     * Check if a header has been written to the socket.
     */
    get headerSent() {
        return this.res?.headersSent ?? false;
    }
    /**
     * Vary on `field`
     */
    vary() {
        if (this.headerSent)
            return;
    }
    /**
     * Perform a 302 redirect to `url`.
     */
    redirect(url, alt) {
        if (url === 'back')
            url = this.ctx.get('Referrer') || (alt ?? '/');
        this.set('Location', encodeurl_1.default(url));
        if (!statuses_1.default.redirect[this.status])
            this.status = 302;
        if (this.ctx.accepts('html')) {
            url = escape_html_1.default(url);
            this.type = 'text/html; charset=utf-8';
            this.body = `Redirecting to <a href="${url}">${url}</a>`;
            return;
        }
        this.type = 'text/plain; charset=utf-8';
        this.body = `Redirecting to ${url}.`;
    }
    /**
     * Set Content-Disposition header to "attachment" with optional `filename`( ...args );
     */
    attachment(filename, options) {
        if (filename)
            this.type = path_1.extname(filename);
        this.set('Content-Disposition', content_disposition_1.default(filename, options));
    }
    /**
     * Set Content-Type response header with `type` through `mime.lookup()`
     */
    set type(type) {
        type = cache_content_type_1.default(type);
        if (type) {
            this.set('Content-Type', type);
        }
        else {
            this.remove('Content-Type');
        }
    }
    /**
     * Return the response mime type void of parameters such as "charset".
     */
    get type() {
        return this.get('Content-Type').split(';', 1)[0] || '';
    }
    /**
     * Set the Last-Modified date using a string or a Date.
     */
    set lastModified(val) {
        if (typeof val === 'string')
            val = new Date(val);
        this.set('Last-Modified', val.toUTCString());
    }
    /**
     * Get the Last-Modified date in Date form, if it exists
     */
    get lastModified() {
        const date = this.get('Last-Modified');
        if (date)
            return new Date(date);
        return undefined;
    }
    /**
     * Set the ETag of a response
     */
    set etag(val) {
        if (!/^(W\/)?"/.test(val))
            val = `"${val}"`;
        this.set('ETag', val);
    }
    /**
     * Get the ETag of a response
     */
    get etag() {
        return this.get('ETag') || '';
    }
    /**
     * Check whether the response is one of the listed types.
     * Pretty much the same as `this.request.is()`.
     */
    is(...args) {
        return type_is_1.is(this.type, ...args);
    }
    /**
     * Return response header.
     */
    get(field) {
        return __classPrivateFieldGet(this, _headers).get(field.toLowerCase());
    }
    /**
     * Returns true if the header identified by name is currently set in the outgoing headers.
     * The header name matching is case-insensitive.
     */
    has(field) {
        return __classPrivateFieldGet(this, _headers).has(field);
    }
    /**
     * Set header `field` to `val` or pass an object of header fields
     */
    set(field, val) {
        if (this.headerSent)
            return;
        if (arguments.length === 2) {
            __classPrivateFieldGet(this, _headers).set(field.toLowerCase(), val);
        }
        else {
            for (const key in field)
                this.set(key, field[key]);
        }
    }
    /**
     * Append additional header `field` with value `val`.
     */
    append(field, val) {
        const prev = this.get(field);
        if (prev !== undefined) {
            if (Array.isArray(prev)) {
                val = prev.concat(String(val));
            }
            else if (typeof prev === 'number') {
                val = [String(prev)].concat(String(val));
            }
            else {
                val = [prev].concat(String(val));
            }
        }
        this.set(field, val);
    }
    /**
     * Remove header `field`
     */
    remove(field) {
        if (this.headerSent)
            return;
        __classPrivateFieldGet(this, _headers).delete(field.toLowerCase());
    }
    getHeaderNames() {
        return Array.from(__classPrivateFieldGet(this, _headers).keys());
    }
    /**
     * Checks if the request if writable.
     * Tests for the existence of the socket
     * as node sometimes does not set it.
     */
    get writable() {
        /**
         * if the native res object is not set, return true directly
         */
        if (!this.res)
            return true;
        /**
         * can't write any more after response finished
         */
        if (this.res.writableEnded || this.res.finished)
            return false;
        const socket = this.res.socket;
        if (!socket)
            return true;
        return socket.writable;
    }
    /**
     * Inspect implementation
     */
    inspect() {
        return { ...this.toJSON(), body: this.body };
    }
    /**
     * Return JSON representation
     */
    toJSON() {
        return {
            status: this.status,
            message: this.message,
            headers: this.headers
        };
    }
    /**
     * Flush any set headers and begin the body
     */
    flushHeaders() {
        this.res?.flushHeaders();
    }
    [(_headers = new WeakMap(), _body = new WeakMap(), util_1.default.inspect.custom)]() {
        return this.inspect();
    }
}
exports.Response = Response;
