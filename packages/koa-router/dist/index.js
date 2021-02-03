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
function match(rule, path, options = {}) {
    const keys = [];
    const matches = path_to_regexp_1.pathToRegexp(rule, keys, options).exec(path);
    if (!matches)
        return false;
    const params = {};
    keys.forEach((key, i) => {
        matches[i + 1] && (params[key.name] = matches[i + 1]);
    });
    if (matches.groups) {
        const { groups } = matches;
        for (const key of Object.keys(groups)) {
            groups[key] && (params[key] = groups[key]);
        }
    }
    return { params, matches };
}
async function execute(ctx, next, rule, fn, options = {}) {
    const res = match(rule, ctx.path, options);
    if (res === false) {
        ctx.params = {};
        ctx.routerMatches = [];
        return next();
    }
    const args = res.matches.slice(1).map(v => decodeURIComponent(v));
    ctx.routerMatches = args;
    ctx.params = res.params;
    return Promise.resolve(fn.call(this.app, ctx, next, ...args));
}
function createMethod(method) {
    return (path, fn, options = {}) => {
        if (Array.isArray(fn))
            fn = koa_1.compose(fn);
        const func = async (ctx, next) => {
            if (method !== ctx.method)
                return next();
            return execute.call(this, ctx, next, path, fn, options);
        };
        if (!this.app)
            return func;
        return this.app.use(func);
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
        /**
         * compose all middlwares if the third argument is a list of middleware function
         */
        if (Array.isArray(args[1]))
            args[1] = koa_1.compose(args[1]);
        /**
         * the first argument should be case insensitive.
         * to uppercase all strings for try matching ctx.method.
         */
        if (Array.isArray(methods)) {
            methods = methods.map((method) => method.toUpperCase());
        }
        else {
            methods = methods.toUpperCase();
        }
        const func = async (ctx, next) => {
            methodCheck: {
                if (methods === '*')
                    break methodCheck;
                if (typeof methods === 'string' && methods !== ctx.method)
                    return next();
                if (Array.isArray(methods) && !methods.includes(ctx.method))
                    return next();
            }
            return execute.call(this, ctx, next, ...args);
        };
        return this.app ? this.app.use(func) : func;
    }
}
exports.default = default_1;
default_1.match = match;
