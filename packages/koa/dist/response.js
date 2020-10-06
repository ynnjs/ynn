"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/response.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/01/2020
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const stream_1 = __importDefault(require("stream"));
const assert_1 = __importDefault(require("assert"));
const vary_1 = __importDefault(require("vary"));
const statuses_1 = __importDefault(require("statuses"));
const encodeurl_1 = __importDefault(require("encodeurl"));
const escape_html_1 = __importDefault(require("escape-html"));
const type_is_1 = require("type-is");
const on_finished_1 = __importDefault(require("on-finished"));
const cache_content_type_1 = __importDefault(require("cache-content-type"));
const content_disposition_1 = __importDefault(require("content-disposition"));
const BODY = Symbol('body');
const EXPLICIT_STATUS = Symbol('explicit#status');
const RESPOND_EXPLICIT_NULL_BODY = Symbol.for('respond#explicit#null#body');
const Response = {
    /**
     * Return the request socket
     */
    get socket() {
        return this.req.socket;
    },
    /**
     * Return response headers
     */
    get header() {
        return this.headers;
    },
    get headers() {
        return this.res.getHeaders() || {};
    },
    /**
     * Get response status code
     */
    get status() {
        return this.res.statusCode;
    },
    /**
     * Set response status code
     */
    set status(code) {
        if (this.headerSent)
            return;
        assert_1.default(code >= 100 && code <= 999, `invalid status code: ${code}`);
        this[EXPLICIT_STATUS] = true;
        this.res.statusCode = code;
        if (this.req.httpVersionMajor < 2)
            this.res.statusMessage = statuses_1.default.message[code];
        if (this.body && statuses_1.default.empty[code])
            this.body = null;
    },
    /**
     * Get response status message
     */
    get message() {
        return this.res.statusMessage || statuses_1.default.message[this.status] || '';
    },
    /**
     * Set response status message
     */
    set message(msg) {
        this.res.statusMessage = msg;
    },
    /**
     * Get response body.
     */
    get body() {
        return this[BODY];
    },
    /**
     * Set response body
     */
    set body(val) {
        const original = this[BODY];
        this[BODY] = val;
        // no content
        if (null == val) {
            if (!statuses_1.default.empty[this.status])
                this.status = 204;
            if (val === null)
                this[RESPOND_EXPLICIT_NULL_BODY] = true;
            this.remove('Content-Type');
            this.remove('Content-Length');
            this.remove('Transfer-Encoding');
            return;
        }
        // set the status
        if (!this[EXPLICIT_STATUS])
            this.status = 200;
        // set the content-type only if not yet set
        const setType = !this.has('Content-Type');
        // string
        if ('string' === typeof val) {
            if (setType)
                this.type = /^\s*</.test(val) ? 'html' : 'text';
            this.length = Buffer.byteLength(val);
            return;
        }
        // buffer
        if (Buffer.isBuffer(val)) {
            if (setType)
                this.type = 'bin';
            this.length = val.length;
            return;
        }
        // stream
        if (val instanceof stream_1.default) {
            on_finished_1.default(this.res, () => val.destroy());
            if (original != val) {
                val.once('error', e => this.ctx.onerror(e));
                /// overwriting
                if (null != original)
                    this.remove('Content-Length');
            }
            if (setType)
                this.type = 'bin';
            return;
        }
        // json
        this.remove('Content-Length');
        this.type = 'json';
    },
    /**
     * Set Content-Length field to `n`.
     */
    set length(n) {
        n !== undefined && this.set('Content-Length', String(n));
    },
    /**
     * Return parsed response Content-Length when present
     */
    get length() {
        if (this.has('Content-Length')) {
            return parseInt(this.get('Content-Length'), 10) || 0;
        }
        const { body } = this;
        if (!body || body instanceof stream_1.default)
            return undefined;
        if ('string' === typeof body)
            return Buffer.byteLength(body);
        if (Buffer.isBuffer(body))
            return body.length;
        return Buffer.byteLength(JSON.stringify(body));
    },
    /**
     * Check if a header has been written to the socket.
     */
    get headerSent() {
        return this.res.headersSent;
    },
    /**
     * Vary on `field`.
     */
    vary(field) {
        if (this.headerSent)
            return;
        vary_1.default(this.res, field);
    },
    /**
     * Perform a 302 redirect `url `.
     *
     * The string "back" is special-cased to provide Referrer support,
     * when Referrer is not present `alt` or "/" is used.
     *
     * Examples:
     *
     *      this.redirect( 'back' );
     *      this.redirect( 'back', '/index.html' );
     *      this.redirect( '/login' );
     *      this.redirect( 'http://google.com' );
     */
    redirect(url, alt) {
        // location
        if ('back' === url)
            url = this.ctx.get('Referrer') || alt || '/';
        this.set('Location', encodeurl_1.default(url));
        // status
        if (!statuses_1.default.redirect[this.status])
            this.status = 302;
        // html
        if (this.ctx.accepts('html')) {
            url = escape_html_1.default(url);
            this.type = 'text/html; charset=utf-8';
            this.body = `Redirecting to <a href="${url}">${url}</a>.`;
            return;
        }
        // text
        this.type = 'text/plain; charset=utf-8';
        this.body = `Redirecting to ${url}.`;
    },
    /**
     * Set Content-Disposition header to "attachment" with optional `filename`.
     */
    attachment(filename, options) {
        if (filename)
            this.type = path_1.default.extname(filename);
        this.set('Content-Disposition', content_disposition_1.default(filename, options));
    },
    /**
     * Set Content-Type response header with `type` through `mime.lookup()`
     * when it does not contain a charset.
     *
     * Examples:
     *
     *      this.type = '.html';
     *      this.type = 'html';
     *      this.type = 'json';
     *      this.type = 'application/json';
     *      this.type = 'png';
     */
    set type(type) {
        type = cache_content_type_1.default(type);
        if (type) {
            this.set('Content-Type', type);
        }
        else {
            this.remove('Content-Type');
        }
    },
    /**
     * Set the Last-Modified date using a string or a Date.
     *
     *      this.response.lastModified = new Date();
     *      this.response.lastModified = '2013-09-13';
     */
    set lastModified(val) {
        if (!val)
            return;
        if ('string' === typeof val)
            val = new Date(val);
        this.set('Last-Modified', val.toUTCString());
    },
    /**
     * Get the Last-Modified date in Date form, if it exists.
     */
    get lastModified() {
        const date = this.get('last-modified');
        if (date)
            return new Date(date);
    },
    /**
     * Set the ETag of a response. This will normalize the quotes if necessary.
     *
     *      this.response.etag = 'md5hashsum';
     *      this.response.etag = '"md5hashsum"';
     *      this.response.etag = 'W//"123456789"';
     */
    set etag(val) {
        if (!/^(W\/)?"/.test(val))
            val = `"${val}"`;
        this.set('ETag', val);
    },
    /**
     * Get the ETag of a response.
     */
    get etag() {
        return this.get('ETag');
    },
    /**
     * Return the response mime type void of parameters such as "charset".
     */
    get type() {
        return this.get('Content-Type')?.split(';', 1)[0] || '';
    },
    /**
     * Check whether the response is one of the listed types.
     * Pretty much the same as `this.request.is()`.
     */
    is(...types) {
        return type_is_1.is(this.type, ...types);
    },
    /**
     * Return response header.
     *
     * Examples:
     *
     *      this.get( 'Content-Type' ); // => "text/plain"
     *      this.get( 'Content-Type' ); // => "text/plain"
     */
    get(field) {
        return this.headers[field.toLowerCase()] || '';
    },
    /**
     * Returns true if the header identified by name is currently set in the outgoing headers.
     * The header name matching is case-insensitive.
     *
     * Examples:
     *
     *      this.has( 'Content-Type' ); // => true
     *      this.has( 'Content-Type' ); // => true
     */
    has(field) {
        return this.res.hasHeader(field);
    },
    /**
     * Set header `field` to `val` or pass an object of header fields
     *
     * Examples:
     *
     *      this.set( 'Foo', [ 'bar', 'baz' ] );
     *      this.set( 'Accept', 'application/json' );
     *      this.set( { Accept: 'text/plain', 'X-API-Key' : 'tobi' } );
     */
    set(field, val) {
        if (this.headerSent)
            return;
        if (typeof val === 'undefined')
            val = String(val);
        if (2 === arguments.length) {
            this.res.setHeader(field, val);
        }
        else {
            for (const key in field) {
                this.set(key, field[key]);
            }
        }
    },
    /**
     * Append additional header `field` with value `val`.
     *
     * Examples:
     *
     *      this.append( 'Link', [ '<http://localhost/>', '<http://localhost:3000/>' ] );
     *      this.append( 'Set-Cookie', 'foo=bar; Path=/; HttpOnly' );
     *      this.append( 'Warning', '199 Miscellaneous warning' );
     */
    append(field, val) {
        const prev = this.get(field);
        if (prev) {
            val = Array.isArray(prev) ? prev.concat(val) : [prev].concat(val);
        }
        this.set(field, val);
    },
    /**
     * Remove header `field`.
     */
    remove(field) {
        if (this.headerSent)
            return;
        this.res.removeHeader(field);
    },
    /**
     * Checks if the request is writable.
     * Tests for the existence of the socket as node sometimes does not set it.
     */
    get writable() {
        // Can't write any more after response finished
        return this.res.writableEnded ? false : (this.res.socket?.writable ?? true);
    },
    /**
     * Inspect implementation.
     */
    inspect() {
        if (!this.res)
            return;
        return { ...this.toJSON(), body: this.body };
    },
    [util_1.default.inspect.custom]() {
        return this.inspect();
    },
    /**
     * Return JSON representation
     */
    toJSON() {
        return {
            status: this.status,
            message: this.message,
            headers: this.headers
        };
    },
    /**
     * Flush any set headers and begin the body
     */
    flushHeaders() {
        this.res.flushHeaders();
    }
};
exports.default = Response;
