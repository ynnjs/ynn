"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/context.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/02/2020
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const cookies_1 = __importDefault(require("cookies"));
const statuses_1 = __importDefault(require("statuses"));
const http_errors_1 = __importDefault(require("http-errors"));
const http_assert_1 = __importDefault(require("http-assert"));
const delegates_1 = __importDefault(require("./delegates"));
const COOKIES = Symbol('cookies');
const context = {
    /**
     * util.inspect() implementation which just returns the JSON output.
     */
    inspect() {
        if (this === context)
            return this;
        return this.toJSON();
    },
    [util_1.default.inspect.custom]() {
        return this.inspect();
    },
    /**
     * Return JSON representation.
     *
     * Here we explicitly invoke .toJSON() on each object,
     * as iteration will otherwise fail due to the getters and cause utilities such clone() to fail.
     */
    toJSON() {
        return {
            request: this.request.toJSON(),
            response: this.response.toJSON(),
            app: this.app.toJSON(),
            originalUrl: this.originalUrl,
            req: '<original node req>',
            res: '<original node res>',
            socket: '<original node socket>'
        };
    },
    /**
     * Similar to .throw(), adds assertion.
     *
     *      this.assert( this.user, 401, 'Please login!' );
     *
     * See: https://github.com/jshttp/http-assert
     */
    assert: http_assert_1.default,
    /**
     * Throw an error with `status` (default 500) and `msg`.
     * Note that these are user-level errors,
     * and the message may be exposed to the client.
     *
     *      this.throw( 403 );
     *      this.throw( 400, 'name required' );
     *      this.throw( 'something exploded' );
     *      this.throw( new Error( 'invalid' ) );
     *      this.throw( 400, new Error( 'invalid' ) );
     *
     * See: https://github.com/jshttp/http-errors
     *
     * Note: `status` should only be passed as the first parameter.
     */
    throw(...args) {
        throw http_errors_1.default(...args);
    },
    /**
     * Default error handling.
     */
    onerror(e) {
        // don't do anything if there is no error.
        // this allows you to pass `this.onerror` to node-style callbacks.
        if (null === e)
            return;
        // When dealing with cross-globals a normal `instanceof` check doesn't work properly
        // See https://github.com/koajs/koa/issues/1466
        // We can probably remove it onec jest fixes https://github.com/facekbook/jest/issues/2549.
        if (({}).toString.call(e) !== '[object Error]' && !(e instanceof Error)) {
            e = new Error(util_1.default.format('non-error thrown: %j', e));
        }
        let headerSent = false;
        if (this.headerSent || !this.writable) {
            headerSent = e.headerSent = true;
        }
        // delegate
        this.app.emit('error', e, this);
        // nothing we can do here other than delegate to the app-level handler and log
        if (headerSent)
            return;
        const { res } = this;
        // first unset all headers
        res.getHeaderNames().forEach(name => res.removeHeader(name));
        // then set those specified
        this.set(e.headers);
        // force text/plain
        this.type = 'text';
        let statusCode = e.status || e.statusCode;
        // ENOENT support
        if ('ENOENT' === e.code)
            statusCode = 404;
        // default to 500
        if ('number' !== typeof statusCode || !statuses_1.default.message[statusCode])
            statusCode = 500;
        // respond
        const code = statuses_1.default.message[statusCode];
        const msg = e.expose ? e.message : code;
        this.status = e.status = statusCode;
        this.length = Buffer.byteLength(msg);
        res.end(msg);
    },
    get cookies() {
        return this[COOKIES] ||= new cookies_1.default(this.req, this.res, {
            keys: this.app.keys,
            secure: this.request.secure
        });
    },
    set cookies(cookies) {
        this[COOKIES] = cookies;
    }
};
/**
 * Response delegation.
 */
new delegates_1.default(context, 'response')
    .methods('attachment', 'redirect', 'remove', 'vary', 'has', 'set', 'append', 'flushHeaders')
    .accesses('status', 'message', 'body', 'length', 'type', 'lastModified', 'etag')
    .getters('headerSent', 'writable');
/**
 * Request delegation.
 */
new delegates_1.default(context, 'request')
    .methods('acceptsLanguages', 'acceptsEncodings', 'acceptsCharsets', 'accepts', 'get', 'is')
    .accesses('querystring', 'idempotent', 'socket', 'search', 'method', 'query', 'path', 'url', 'accept')
    .getters('origin', 'href', 'subdomains', 'protocol', 'host', 'hostname', 'URL', 'header', 'headers', 'secure', 'stale', 'fresh', 'ips', 'ip');
exports.default = context;
