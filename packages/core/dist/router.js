"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/router.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/01/2020
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const path_to_regexp_1 = require("path-to-regexp");
const koa_1 = require("@ynn/koa");
const isRegExp = util_1.default.types.isRegExp;
function match(path, ctx, options) {
    if (isRegExp(path)) {
        const matches = ctx.path.match(path);
        matches.groups && (ctx.params = matches.groups);
        return matches;
    }
    const keys = [];
    const matches = path_to_regexp_1.pathToRegexp(path, keys, options).exec(ctx.path);
    if (matches) {
        for (let i = 0, l = keys.length; i < l; i += 1) {
            const { name } = keys[i];
            ctx.params[name] = matches[i + 1];
        }
        return matches;
    }
    return false;
}
function execute(ctx, next, path, fn, options = {}) {
    ctx.params || (ctx.params = {});
    let matches = false;
    if (Array.isArray(path)) {
        for (const item of path) {
            matches = match(item, ctx, options);
            if (matches)
                break;
        }
    }
    else {
        matches = match(path, ctx, options);
    }
    if (!matches)
        return next();
    const args = matches.slice(1).map(v => decodeURIComponent(v));
    ctx.routerMatches = args;
    return Promise.resolve(fn.call(this.app, ctx, next, ...args));
}
function createMethod(method) {
    return (path, fn, options = {}) => {
        if (Array.isArray(fn))
            fn = koa_1.compose(fn);
        const func = (ctx, next) => {
            if (method !== ctx.method)
                return next();
            return execute.call(this, ctx, next, path, fn, options);
        };
        return this.app ? this.app.use(func) : func;
    };
}
class default_1 {
    constructor(app) {
        this.app = app;
        this.get = createMethod.call(this, 'get');
        this.put = createMethod.call(this, 'put');
        this.head = createMethod.call(this, 'head');
        this.post = createMethod.call(this, 'post');
        this.patch = createMethod.call(this, 'patch');
        this.delete = createMethod.call(this, 'delete');
        this.options = createMethod.call(this, 'options');
    }
    any(methods, ...args) {
        if (Array.isArray(args[1]))
            args[1] = koa_1.compose(args[1]);
        const func = (ctx, next) => {
            if (methods !== '*' && !methods.includes(ctx.method))
                return next();
            return execute.call(this, ctx, next, ...args);
        };
        return this.app ? this.app.use(func) : func;
    }
}
exports.default = default_1;
