"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/respond.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/16/2021
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.respond = void 0;
const stream_1 = __importDefault(require("stream"));
const statuses_1 = __importDefault(require("statuses"));
function setHeaders(headers, res) {
    Object.keys(headers).forEach((field) => {
        if (headers[field] !== undefined) {
            res.setHeader(field, headers[field]);
        }
    });
}
function respond(ctx, req, res) {
    const { status, message, response } = ctx;
    res.statusCode = status;
    res.statusMessage = message;
    if (statuses_1.default.empty[status]) {
        ctx.body = null;
        setHeaders(response.headers, res);
        res.end();
        return;
    }
    if (ctx.method === 'HEAD') {
        if (!res.headersSent && !ctx.response.has('Content-Length')) {
            const { length } = ctx.response;
            if (Number.isInteger(length))
                ctx.length = length;
        }
        setHeaders(response.headers, res);
        res.end();
        return;
    }
    let { body } = ctx;
    if (body === null) {
        if (ctx.response.EXPLICIT_NULL_BODY) {
            ctx.response.remove('Content-Type');
            ctx.response.remove('Transfer-Encoding');
            setHeaders(response.headers, res);
            res.end();
            return;
        }
        if (req.httpVersionMajor >= 2) {
            body = String(status);
        }
        else {
            body = message || String(status);
        }
        if (!res.headersSent) {
            ctx.type = 'text';
            ctx.length = Buffer.byteLength(body);
        }
        setHeaders(response.headers, res);
        res.end(body);
        return;
    }
    if (Buffer.isBuffer(body) || typeof body === 'string') {
        res.end(body);
        return;
    }
    if (body instanceof stream_1.default) {
        body.pipe(res);
        return;
    }
    body = JSON.stringify(body);
    if (!res.headersSent) {
        ctx.length = Buffer.byteLength(body);
    }
    setHeaders(response.headers, res);
    res.end(body);
}
exports.respond = respond;
