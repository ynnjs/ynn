"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/router.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/01/2020
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
const path_to_regexp_1 = require("path-to-regexp");
const koa_1 = require("@ynn/koa");
function match(path, ctx, options = {}) {
    const keys = [];
    const matches = path_to_regexp_1.pathToRegexp(path, keys, options).exec(ctx.path);
    ctx.params || (ctx.params = {});
    if (!matches)
        return false;
    for (let i = 0, l = keys.length; i < l; i += 1) {
        ctx.params[keys[i].name] = matches[i + 1];
    }
    if (matches.groups) {
        const { groups } = matches;
        for (const key of Object.keys(groups)) {
            groups[key] && (ctx.params[key] = groups[key]);
        }
    }
    return matches;
}
function execute(ctx, next, path, fn, options = {}) {
    const matches = match(path, ctx, options);
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
        this.get = createMethod.call(this, 'GET');
        this.put = createMethod.call(this, 'PUT');
        this.head = createMethod.call(this, 'HEAD');
        this.post = createMethod.call(this, 'POST');
        this.patch = createMethod.call(this, 'PATCH');
        this.delete = createMethod.call(this, 'DELETE');
        this.options = createMethod.call(this, 'OPTIONS');
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
default_1.match = match;
