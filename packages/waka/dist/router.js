"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/router.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/31/2021
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
const path_to_regexp_1 = require("path-to-regexp");
function match(pattern, path, options) {
    const keys = [];
    const matches = path_to_regexp_1.pathToRegexp(pattern, keys, options).exec(path);
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
class Router {
    constructor() {
        this.rules = [];
    }
    get(...args) {
        this.rules.push(['GET', ...args]);
    }
    post(...args) {
        this.rules.push(['POST', ...args]);
    }
    put(...args) {
        this.rules.push(['PUT', ...args]);
    }
    head(...args) {
        this.rules.push(['HEAD', ...args]);
    }
    patch(...args) {
        this.rules.push(['PATCH', ...args]);
    }
    delete(...args) {
        this.rules.push(['DELETE', ...args]);
    }
    options(...args) {
        this.rules.push(['OPTIONS', ...args]);
    }
    any(...args) {
        const [methods, ...rest] = args;
        /**
         * Uppercase the method(s) before appending in to the rules list, in order to avoid uppercasing the strings everytime in every request.
         */
        if (typeof methods === 'string') {
            this.rules.push([methods.toUpperCase(), ...rest]);
            return;
        }
        this.rules.push([methods.map(m => m.toUpperCase()), ...rest]);
    }
    match(context) {
        const { path, method } = context;
        for (const rule of this.rules) {
            const [methods, pattern] = rule;
            if (methods !== '*') {
                if (typeof methods === 'string' && methods !== method)
                    continue;
                if (Array.isArray(methods) && !methods.includes(method))
                    continue;
            }
            let res;
            if (typeof pattern === 'object' && 'pattern' in pattern) {
                res = match(pattern.pattern, path, pattern.options);
            }
            else {
                res = match(pattern, path);
            }
            if (res === false)
                break;
            const args = res.matches.slice(1); // .map( v => decodeURIComponent( v ) );
            return {
                params: res.params,
                matches: args,
                rule
            };
        }
        return false;
    }
}
exports.default = Router;
