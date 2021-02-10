"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/context.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/05/2021
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const http_assert_1 = __importDefault(require("http-assert"));
const request_1 = require("./request");
const response_1 = require("./response");
class Context {
    constructor(options) {
        this.assert = http_assert_1.default;
        options.app && (this.app = options.app);
        this.request = new request_1.Request({ ...options.request, ctx: this });
        this.response = new response_1.Response({ ...(options.response ?? {}), ctx: this });
    }
    /**
     * Throw an error with `status` (default 500) and `msg`.
     * Note that these are user-level errors, and the message may be exposed to the client.
     */
    throw(...args) {
        throw http_errors_1.default(...args);
    }
    inspect() {
        return this.toJSON();
    }
    toJSON() {
        return {
            request: this.request.toJSON(),
            resposne: this.response.toJSON(),
            app: this.app?.toJSON() || null
        };
    }
    // get cookies(): Cookies {}
    // set cookies() {}
    attachment(...args) {
        this.response.attachment(...args);
    }
    redirect(...args) {
        this.response.redirect(...args);
    }
    remove(...args) {
        this.response.remove(...args);
    }
    // vary() {}
    has(...args) {
        return this.response.has(...args);
    }
    set(...args) {
        this.response.set(...args);
    }
    append(...args) {
        this.response.append(...args);
    }
    flushHeaders() {
        this.response.flushHeaders();
    }
    get status() {
        return this.response.status;
    }
    set status(code) {
        this.response.status = code;
    }
    get message() {
        return this.response.message;
    }
    set message(msg) {
        this.response.message = msg;
    }
    get body() {
        return this.response.body;
    }
    set body(val) {
        this.response.body = val;
    }
    get length() {
        return this.response.length;
    }
    set length(n) {
        this.response.length = n;
    }
    get type() {
        return this.response.type;
    }
    set type(type) {
        this.response.type = type;
    }
    get lastModified() {
        return this.response.lastModified;
    }
    set lastModified(val) {
        this.response.lastModified = val;
    }
    get etag() {
        return this.response.etag;
    }
    set etag(val) {
        this.response.etag = val;
    }
    get headerSent() {
        return this.response.headerSent;
    }
    get writable() {
        return this.response.writable;
    }
    acceptsLanguages(...args) {
        return this.request.acceptsLanguages(...args);
    }
    acceptsEncodings(...args) {
        return this.request.acceptsEncodings(...args);
    }
    acceptsCharsets(...args) {
        return this.request.acceptsCharsets(...args);
    }
    accepts(...args) {
        return this.request.accepts(...args);
    }
    get(field) {
        return this.request.get(field);
    }
    is(...args) {
        return this.request.is(...args);
    }
    get querystring() {
        return this.request.querystring;
    }
    set querystring(str) {
        this.request.querystring = str;
    }
    get idempotent() {
        return this.request.idempotent;
    }
    get socket() {
        return this.request.socket;
    }
    get search() {
        return this.request.search;
    }
    set search(str) {
        this.request.search = str;
    }
    get method() {
        return this.request.method;
    }
    set method(method) {
        this.request.method = method;
    }
    get query() {
        return this.request.query;
    }
    get path() {
        return this.request.path;
    }
    set path(pathname) {
        this.request.path = pathname;
    }
    get url() {
        return this.request.url;
    }
    get accept() {
        return this.request.accept;
    }
    set accept(accepts) {
        this.request.accept = accepts;
    }
    get origin() {
        return this.request.origin;
    }
    get href() {
        return this.request.href;
    }
    get subdomains() {
        return this.request.subdomains;
    }
    get protocol() {
        return this.request.protocol;
    }
    get host() {
        return this.request.host;
    }
    get hostname() {
        return this.request.hostname;
    }
    get URL() {
        return this.request.URL;
    }
    get headers() {
        return this.request.headers;
    }
    get secure() {
        return this.request.secure;
    }
    get stale() {
        return this.request.stale;
    }
    get fresh() {
        return this.request.fresh;
    }
    get ips() {
        return this.request.ips;
    }
    get ip() {
        return this.request.ip;
    }
}
exports.default = Context;
