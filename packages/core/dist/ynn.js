"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/ynn.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/26/2020
 * Description:
 ******************************************************************/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _address, _configs, _setupDebug, _setupLogger, _options, _setupRouter, _setup;
Object.defineProperty(exports, "__esModule", { value: true });
const escape_string_regexp_1 = __importDefault(require("escape-string-regexp"));
const is_1 = __importDefault(require("@lvchengbin/is"));
const koa_1 = __importStar(require("@ynn/koa"));
const cargs_1 = __importDefault(require("./cargs"));
const debug_1 = __importDefault(require("./debug"));
const logger_proxy_1 = __importDefault(require("./logger-proxy"));
const router_1 = __importDefault(require("./router"));
class Ynn extends koa_1.default {
    constructor(options = {}) {
        super();
        this.server = null;
        this.isModule = false;
        this.controllers = [];
        this.providers = [];
        _address.set(this, null);
        _configs.set(this, []);
        _setupDebug.set(this, (options) => {
            const opts = {
                levels: options.debugging,
                ...options.debugOptions
            };
            this.debug = options.debug || new debug_1.default(opts);
        });
        _setupLogger.set(this, (options) => {
            const { logger, logging = false, debugging = true } = options;
            this.logger = logger_proxy_1.default({
                debug: this.debug,
                logging, debugging, logger
            });
        });
        _options.set(this, void 0);
        _setupRouter.set(this, (options) => {
            const router = new router_1.default(this);
            if (options.routers) {
                let rules;
                if (typeof options.routers === 'function') {
                    rules = options.routers(router, this);
                }
                rules && rules.forEach((rule) => {
                    if (rule.length === 2) {
                        rule = ['*', ...rule];
                    }
                    if (typeof rule[2] === 'function') {
                        router.any(...rule);
                        return;
                    }
                    let map;
                    if (typeof rule[2] === 'string') {
                        const [controller, action] = rule[2].split('.');
                        map = { controller, action };
                    }
                    else {
                        map = { ...rule[2] };
                    }
                    router.any(rule[0], rule[1], (ctx, next) => {
                        return this.execute(map, ctx, next);
                    });
                });
            }
            this.modules && Object.keys(this.modules).forEach((module) => {
                const regexp = new RegExp(`^/${escape_string_regexp_1.default(module)}(/|$)`, 'i');
                router.any('*', `/${module}/.*`, (ctx, next) => {
                    ctx.originalPath = ctx.path || '/';
                    ctx.path = ctx.path.replace(regexp, '/');
                    const [, controller, action] = ctx.path.split('/', 3);
                    return this.execute({ module, controller, action }, ctx, next);
                });
            });
            router.any('*', /.*/, (ctx, next) => {
                const [, controller, action] = ctx.path.split('/', 3);
                return this.execute({ controller, action }, ctx, next);
            });
            this.router = router;
        });
        _setup.set(this, (options) => {
            __classPrivateFieldSet(this, _options, { ...options, ...cargs_1.default });
            __classPrivateFieldGet(this, _setupDebug).call(this, __classPrivateFieldGet(this, _options));
            __classPrivateFieldGet(this, _setupLogger).call(this, __classPrivateFieldGet(this, _options));
            __classPrivateFieldGet(this, _setupRouter).call(this, __classPrivateFieldGet(this, _options));
        });
        this.isModule = !!options.isModule;
        this.modules = options.modules || {};
        __classPrivateFieldGet(this, _setup).call(this, options);
    }
    listen(...args) {
        if (__classPrivateFieldGet(this, _options).port) {
            if (Number.isInteger(args[0])) {
                args[0] = __classPrivateFieldGet(this, _options).port;
            }
            else {
                args.unshift(__classPrivateFieldGet(this, _options).port);
            }
        }
        this.server = super.listen(...args);
        __classPrivateFieldSet(this, _address, this.server.address());
        this.debug.log(`Server is running on port ${__classPrivateFieldGet(this, _address).port}`);
        return this.server;
    }
    summary() {
        return {
            'log-path': __classPrivateFieldGet(this, _options)['log-path'],
            port: __classPrivateFieldGet(this, _address)?.port ?? null
        };
    }
    config(path, defaultValue) {
        let res;
        for (const config of __classPrivateFieldGet(this, _configs)) {
            res = config.get(path);
            if (res !== undefined)
                return res;
        }
        return res === undefined ? defaultValue : res;
    }
    execute(map, ctx, next) {
        const { module } = map;
        /**
         * if module is specified
         * upstream to target module if it is not an instance of Ynn but is an instance of Koa.
         * call module.execute if the module is an instance of Ynn.
         */
        if (module) {
            const m = this.modules[module];
            if (!m) {
                this.logger.error(`module ${module} is not loaded.`);
                return;
            }
            ctx.app = m;
            let res;
            if (m instanceof Ynn) {
                res = m.execute({
                    controller: map.controller,
                    action: map.action
                }, ctx, next);
            }
            else {
                const downstream = koa_1.compose(m.middware);
                res = downstream(ctx, next);
            }
            return res.then(value => {
                ctx.app = this;
                return value;
            });
        }
        const { controller = 'index' } = map;
        const Controller = this.controllers[controller];
        if (!Controller) {
            this.logger.error(`controller ${controller} is not loaded.`);
        }
        if (is_1.default.class(Controller)) {
            new Controller();
            return;
        }
        if (typeof Controller === 'function') {
            Controller(ctx);
        }
        return next();
    }
}
exports.default = Ynn;
_address = new WeakMap(), _configs = new WeakMap(), _setupDebug = new WeakMap(), _setupLogger = new WeakMap(), _options = new WeakMap(), _setupRouter = new WeakMap(), _setup = new WeakMap();
Ynn.cargs = cargs_1.default;
