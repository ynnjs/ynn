"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/application.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 09/29/2020
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compose = void 0;
const http_1 = __importDefault(require("http"));
const util_1 = __importDefault(require("util"));
const events_1 = require("events");
const stream_1 = __importDefault(require("stream"));
const on_finished_1 = __importDefault(require("on-finished"));
const statuses_1 = __importDefault(require("statuses"));
const http_errors_1 = require("http-errors");
const context_1 = __importDefault(require("./context"));
const request_1 = __importDefault(require("./request"));
const response_1 = __importDefault(require("./response"));
const compose_1 = __importDefault(require("./middlewares/compose"));
exports.compose = compose_1.default;
const debug = util_1.default.debuglog('ynn:koa:application');
const RESPOND_EXPLICIT_NULL_BODY = Symbol.for('respond#explicit#null#body');
class Koa extends events_1.EventEmitter {
    constructor(options = {}) {
        super();
        this.silent = false;
        this.trustXRealIp = false;
        this.context = Object.create(context_1.default);
        this.request = Object.create(request_1.default);
        this.response = Object.create(response_1.default);
        this.middleware = [];
        this.subdomainOffset = 2;
        this.env = 'development';
        this.proxy = options.proxy || false;
        this.subdomainOffset = options.subdomainOffset || 2;
        this.proxyIpHeader = options.proxyIpHeader || 'X-Forwarded-For';
        this.maxIpsCount = options.maxIpsCount || 0;
        this.env = options.env || process.env.NODE_ENV || 'development';
        options.keys && (this.keys = options.keys);
        /* istanbul ignore else */
        if (util_1.default.inspect.custom) {
            this[util_1.default.inspect.custom] = this.inspect;
        }
    }
    /**
     * Shorthand for:
     *
     *      http.createServer( app.callback() ).listen( ... );
     *
     * @param {Mixed}
     * @return {Server}
     */
    listen(...args) {
        debug('listen');
        const server = http_1.default.createServer(this.callback());
        return server.listen(...args);
    }
    /**
     * Return JSON representation.
     * We only bother showing settings.
     *
     * @return {Object}
     */
    toJSON() {
        return {
            subdomainOffset: this.subdomainOffset,
            proxy: this.proxy,
            env: this.env
        };
    }
    /**
     * Inspect implementation.
     *
     * @return {Object}
     */
    inspect() {
        return this.toJSON();
    }
    /**
     * Use the given middleware `fn`
     */
    use(fn) {
        if (typeof fn !== 'function')
            throw new TypeError('middleware must be a function!');
        debug('use %s', fn.name || '-');
        this.middleware.push(fn);
        return this;
    }
    /**
     * Return a request handler callback
     * for node's native http server.
     *
     * @return {Function}
     */
    callback() {
        if (!this.listenerCount('error'))
            this.on('error', this.onerror);
        return (req, res) => this.handleRequest(this.createContext(req, res), compose_1.default(this.middleware));
    }
    /**
     * handle request in callback
     */
    handleRequest(ctx, middleware) {
        const { res } = ctx;
        res.statusCode = 404;
        const onerror = e => ctx.onerror(e);
        on_finished_1.default(res, onerror);
        return middleware(ctx).then(() => {
            if (false === ctx.respond)
                return;
            if (!ctx.writable)
                return;
            let { body, status } = ctx;
            if (statuses_1.default.empty[status]) {
                ctx.body = null;
                return res.end();
            }
            if ('HEAD' === ctx.method) {
                if (!res.headerSent && !ctx.response.has('Content-Length')) {
                    const { length } = ctx.response;
                    Number.isInteger(length) && (ctx.length = length);
                }
                return res.end();
            }
            if (null == body) {
                if (ctx.response[RESPOND_EXPLICIT_NULL_BODY]) {
                    ctx.response.remove('Content-Type');
                    ctx.response.remove('Transfer-Encoding');
                    return res.end();
                }
                if (ctx.req.httpVersionMajor >= 2) {
                    body = String(status);
                }
                else {
                    body = ctx.message || String(status);
                }
                if (!res.headersSent) {
                    ctx.type = 'text';
                    ctx.length = Buffer.byteLength(body);
                }
                return res.end(body);
            }
            if (Buffer.isBuffer(body))
                return res.end(body);
            if ('string' === typeof body)
                return res.end(body);
            if (body instanceof stream_1.default)
                return body.pipe(res);
            body = JSON.stringify(body);
            if (!res.headersSent) {
                ctx.length = Buffer.byteLength(body);
            }
            res.end(body);
        }).catch(onerror);
    }
    /**
     * Initialize a new context
     */
    createContext(req, res) {
        const context = Object.create(this.context);
        const request = context.request = Object.create(this.request);
        const response = context.response = Object.create(this.response);
        context.app = request.app = response.app = this;
        context.req = request.req = response.req = req;
        context.res = request.res = response.res = res;
        request.ctx = response.ctx = context;
        request.response = response;
        response.request = request;
        context.originalUrl = request.originalUrl = req.url;
        context.state = {};
        return context;
    }
    /**
     * Default error handler.
     */
    onerror(e) {
        // When dealing with cross-globals a normal `instanceof` check doesn't work properly
        // See https://github.com/koajs/koa/issues/1466
        // We can probably remove it onec jest fixes https://github.com/facekbook/jest/issues/2549.
        if (({}).toString.call(e) !== '[object Error]' && !(e instanceof Error)) {
            throw new TypeError(util_1.default.format('non-error thrown: %j', e));
        }
        if (404 === e.status || e.expose)
            return;
        if (this.silent)
            return;
        console.error(`\n${(e.stack || e.toString()).replace(/^/gm, '  ')}\n`);
    }
}
exports.default = Koa;
Koa.HttpError = http_errors_1.HttpError;
