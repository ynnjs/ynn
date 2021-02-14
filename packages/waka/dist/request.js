"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/request.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/07/2021
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
var _ip, _accept, _headers, _parsedurl, _rawParsedurl, _memoizedURL, _querycache, _parseurl;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const util_1 = __importDefault(require("util"));
const querystring_1 = __importDefault(require("querystring"));
const net_1 = require("net");
const url_1 = require("url");
const content_type_1 = __importDefault(require("content-type"));
const type_is_1 = require("type-is");
const accepts_1 = __importDefault(require("accepts"));
const parseurl_1 = require("./util/parseurl");
class Request {
    constructor(options) {
        _ip.set(this, void 0);
        _accept.set(this, void 0);
        _headers.set(this, {});
        _parsedurl.set(this, null);
        _rawParsedurl.set(this, null);
        _memoizedURL.set(this, null);
        _querycache.set(this, {});
        this.body = null;
        this.httpVersionMajor = 1;
        this.proxyIpHeader = 'X-Forwarded-For';
        this.trustXRealIp = false;
        this.subdomainOffset = 2;
        _parseurl.set(this, () => {
            if (!__classPrivateFieldGet(this, _parsedurl) || this.url !== __classPrivateFieldGet(this, _rawParsedurl)) {
                __classPrivateFieldSet(this, _rawParsedurl, this.url);
                __classPrivateFieldSet(this, _parsedurl, parseurl_1.parseurl(this.url));
            }
            return __classPrivateFieldGet(this, _parsedurl);
        });
        this.ctx = options.ctx;
        this.url = options.url;
        this.originalUrl = this.url;
        this.method = options.method;
        options.ip && (__classPrivateFieldSet(this, _ip, options.ip));
        options.req && (this.req = options.req);
        options.body === undefined || (this.body = options.body);
        options.proxyIpHeader && (this.proxyIpHeader = options.proxyIpHeader);
        options.httpVersionMajor && (this.httpVersionMajor = options.httpVersionMajor);
        options.trustXRealIp === undefined || (this.trustXRealIp = options.trustXRealIp);
        options.subdomainOffset === undefined || (this.subdomainOffset = options.subdomainOffset);
        options.headers && (this.headers = { ...options.headers });
    }
    get headers() {
        return __classPrivateFieldGet(this, _headers);
    }
    set headers(headers) {
        __classPrivateFieldSet(this, _headers, {});
        /**
         * keep all names of headers to be lowercase
         */
        Object.keys(headers).forEach((name) => {
            __classPrivateFieldGet(this, _headers)[name.toLowerCase()] = headers[name];
        });
    }
    /**
     * Get origin of URL
     */
    get origin() {
        return `${this.protocol}://${this.host}`;
    }
    /**
     * Get full request URL
     */
    get href() {
        if (/^https?:\/\//i.test(this.originalUrl))
            return this.originalUrl;
        return this.origin + this.originalUrl;
    }
    get path() {
        return __classPrivateFieldGet(this, _parseurl).call(this).pathname ?? '';
    }
    set path(pathname) {
        const url = __classPrivateFieldGet(this, _parseurl).call(this);
        if (url.pathname === pathname)
            return;
        url.pathname = pathname;
        this.url = url_1.format(url);
    }
    get query() {
        var _a;
        const str = this.querystring;
        return (_a = __classPrivateFieldGet(this, _querycache))[str] ?? (_a[str] = querystring_1.default.parse(str));
    }
    get querystring() {
        return __classPrivateFieldGet(this, _parseurl).call(this).query ?? '';
    }
    set querystring(str) {
        const url = __classPrivateFieldGet(this, _parseurl).call(this);
        url.search = str;
        this.url = url_1.format(url);
    }
    get search() {
        return __classPrivateFieldGet(this, _parseurl).call(this).search ?? '';
    }
    set search(str) {
        const url = __classPrivateFieldGet(this, _parseurl).call(this);
        url.search = str;
        this.url = url_1.format(url);
    }
    get host() {
        /**
         * Compatibility with Koa applications.
         */
        let host = this.ctx.app?.proxy && this.get('X-Forwarded-Host');
        if (!host) {
            if (this.httpVersionMajor >= 2)
                host = this.get(':authority');
            if (!host)
                host = this.get('Host');
        }
        if (!host)
            return '';
        return host.split(/\s*,\s*/, 1)[0];
    }
    get hostname() {
        const { host } = this;
        if (!host)
            return '';
        if (host[0].startsWith('['))
            return this.URL.hostname || ''; // IPv6
        return host.split(':', 1)[0];
    }
    /**
     * Get WHATWG parsed URL
     */
    get URL() {
        if (!__classPrivateFieldGet(this, _memoizedURL)) {
            try {
                __classPrivateFieldSet(this, _memoizedURL, new URL(`${this.origin}${this.originalUrl}`));
            }
            catch (e) {
                __classPrivateFieldSet(this, _memoizedURL, Object.create(null));
            }
        }
        return __classPrivateFieldGet(this, _memoizedURL);
    }
    // @@todo
    get fresh() {
        return true;
    }
    get stale() {
        return !this.fresh;
    }
    get idempotent() {
        return ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'TRACE'].includes(this.method);
    }
    get socket() {
        return this.req?.socket ?? null;
    }
    /**
     * Get the charset when present or undefined
     */
    get charset() {
        try {
            return content_type_1.default.parse(this.get('Content-Type')).parameters.charset || '';
        }
        catch (e) {
            return '';
        }
    }
    /**
     * Return parsed `Content-Length` as a number when present, or `undefined`.
     */
    get length() {
        const len = this.get('Content-Length');
        if (len === '')
            return undefined;
        return ~~len;
    }
    get protocol() {
        if (this.socket && this.socket.encrypted)
            return 'https';
        /**
         * support proxy property of Koa application.
         */
        if (this.ctx.app && !this.ctx.app.proxy)
            return 'http';
        return this.get('X-Forwarded-Proto').split(/\s*,\s*/, 1)[0] ?? 'http';
    }
    /**
     * Shorthand for: this.protocol === 'https'.
     */
    get secure() {
        return this.protocol === 'https';
    }
    /**
     * Get IP addresses listed in `X-Forwarded-For` and support the proxy rules in Koa.
     */
    get ips() {
        const val = this.get(this.proxyIpHeader);
        if (!val || (this.ctx.app && !this.ctx.app.proxy))
            return [];
        const ips = val.split(/\s*,\s*/);
        if (this.ctx.app?.maxIpsCount > 0)
            return ips.slice(-this.ctx.app.maxIpsCount);
        return ips;
    }
    /**
     * Return request's remote address
     *
     * support `app.proxy` property of Koa, and use `X-Real-IP` if `trustXRealIp` is true.
     */
    get ip() {
        if (__classPrivateFieldGet(this, _ip))
            return __classPrivateFieldGet(this, _ip);
        if (this.trustXRealIp && this.get('X-Real-IP')) {
            return __classPrivateFieldSet(this, _ip, this.get('X-Real-IP'));
        }
        return __classPrivateFieldSet(this, _ip, (this.ips[0] || (this.socket?.remoteAddress ?? '')));
    }
    set ip(ip) {
        __classPrivateFieldSet(this, _ip, ip);
    }
    /**
     * Return subdomains as an array
     */
    get subdomains() {
        const { hostname } = this;
        if (net_1.isIP(hostname))
            return [];
        return hostname.split('.').reverse().slice(this.subdomainOffset);
    }
    get accept() {
        /**
         * accepts needs IncomingMessage
         * but only the headers property is being used.
         */
        return __classPrivateFieldSet(this, _accept, __classPrivateFieldGet(this, _accept) || accepts_1.default({ headers: this.headers }));
    }
    set accept(accepts) {
        __classPrivateFieldSet(this, _accept, accepts);
    }
    accepts(...args) {
        return this.accept.types(...args);
    }
    acceptsEncodings(...args) {
        return this.accept.encodings(...args);
    }
    acceptsCharsets(...args) {
        return this.accept.charsets(...args);
    }
    acceptsLanguages(...args) {
        return this.accept.languages(...args);
    }
    is(...args) {
        if (this.get('Transfer-Encoding') === '' && isNaN(Number(this.get('Content-Length'))))
            return null;
        return type_is_1.is(this.get('Content-Type'), ...args);
    }
    get type() {
        const type = this.get('Content-Type');
        if (!type)
            return '';
        return type.split(';')[0];
    }
    get(field) {
        switch (field = field.toLowerCase()) {
            case 'referer':
            case 'referrer':
                return this.headers.referrer ?? this.headers.referer ?? '';
            default:
                return this.headers[field] ?? '';
        }
    }
    inspect() {
        return this.toJSON();
    }
    toJSON() {
        return {
            url: this.url,
            method: this.method,
            headers: this.headers
        };
    }
    [(_ip = new WeakMap(), _accept = new WeakMap(), _headers = new WeakMap(), _parsedurl = new WeakMap(), _rawParsedurl = new WeakMap(), _memoizedURL = new WeakMap(), _querycache = new WeakMap(), _parseurl = new WeakMap(), util_1.default.inspect.custom)]() {
        return this.inspect();
    }
}
exports.Request = Request;
