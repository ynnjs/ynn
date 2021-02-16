"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/application.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/10/2021
 * Description:
 ******************************************************************/
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _setup, _setupRouter, _setupControllers;
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const path_1 = __importDefault(require("path"));
const events_1 = __importDefault(require("events"));
const http_1 = __importDefault(require("http"));
const is_1 = __importDefault(require("@lvchengbin/is"));
const method_interceptor_1 = require("@ynn/method-interceptor");
const context_1 = __importDefault(require("./context"));
const action_1 = require("./action");
const router_1 = __importDefault(require("./router"));
const cargs_1 = __importDefault(require("./cargs"));
const respond_1 = __importDefault(require("./util/respond"));
const CWD = process.cwd();
const DEFAULT_CONTROLLER = 'index';
const DEFAULT_ACTION = 'index';
class Application extends events_1.default {
    constructor(options = {}) {
        super();
        /**
         * require.main is undefined is such as interactive mode
         */
        this.root = require.main ? path_1.default.dirname(require.main.filename) : CWD;
        /**
         * map for actions
         */
        this.actions = {};
        _setup.set(this, (options) => {
            this.options = { ...options, ...this.parseCargs(cargs_1.default) };
        });
        _setupRouter.set(this, () => {
            const router = new router_1.default();
            if (typeof this.options.routers === 'function') {
                /**
                 * if `options.routers` is a function,
                 * call the function with the Router instance and Application instance.
                 */
                this.options.routers.call(this, router, this);
            }
            else if (Array.isArray(this.options.routers)) {
                /**
                 * call `router.any` with rules in `options.routers` if it's an array.
                 */
                this.options.routers.forEach((rule) => {
                    router.any(...rule);
                });
            }
            router.any('*', ['/:CONTROLLER/:ACTION', '/:CONTROLLER', '/'], (ctx, params) => ({
                controller: params.CONTROLLER || DEFAULT_CONTROLLER,
                action: params.ACTION || DEFAULT_ACTION
            }));
            this.router = router;
        });
        _setupControllers.set(this, () => {
            const { controllers } = this.options;
            const { actions } = this;
            controllers && Object.keys(controllers).forEach((controllerName) => {
                const Controller = controllers[controllerName];
                if (is_1.default.class(Controller)) {
                    const actionInfos = action_1.scan(Controller.prototype);
                    Object.keys(actionInfos).forEach((actionName) => {
                        const info = actionInfos[actionName];
                        const { descriptor, methodName } = info;
                        if (!actions[controllerName]) {
                            actions[controllerName] = {};
                        }
                        const before = method_interceptor_1.createInterceptorBefore(descriptor);
                        const after = method_interceptor_1.createInterceptorAfter(descriptor);
                        const exception = method_interceptor_1.createInterceptorException(descriptor);
                        const parameter = method_interceptor_1.createInterceptorParameter(info.proto, methodName);
                        const executor = async (context) => {
                            try {
                                await before(context);
                                const controller = new Controller(context);
                                const params = await parameter(context);
                                const response = controller[methodName](...params);
                                return await after(response, context);
                            }
                            catch (e) {
                                return exception(e, context);
                            }
                        };
                        actions[controllerName][actionName] = { info, executor };
                    });
                }
            });
        });
        __classPrivateFieldGet(this, _setup).call(this, options);
        __classPrivateFieldGet(this, _setupRouter).call(this);
        // this.#setupModules();
        __classPrivateFieldGet(this, _setupControllers).call(this);
        // this.#setupProviders();
        // this.modules = { ...options.modules };
        this.controllers = { ...options.controllers };
    }
    parseCargs(cargs) {
        const options = {};
        if ('port' in cargs) {
            if (!is_1.default.integer(cargs.port))
                throw new TypeError('--port must be a integer');
            options.port = parseInt(cargs.port);
        }
        // if( 'debugging' in cargs ) {
        //     options.debuggings = is.generalizedTrue( cargs.debugging );
        // }
        // if( 'logging' in cargs ) {
        //     options.logging = is.generalizedTrue( cargs.logging );
        // }
        // if( 'log-path' in cargs ) {
        //     options[ 'log-path' ] = path.resolve( CWD, cargs[ 'log-path' ] );
        // }
        if ('root' in cargs) {
            options.root = path_1.default.resolve(CWD, String(cargs.root));
        }
        // if( 'config-dir' in cargs ) {
        //     options[ 'config-dir' ] = path.resolve( CWD, cargs[ 'config-dir' ] );
        // }
        return options;
    }
    async handle(context) {
        const ctx = context instanceof context_1.default ? context : new context_1.default(context);
        const match = this.router.match(ctx);
        if (match === false) {
            ctx.status = 404;
        }
        else {
            const { rule, params, matches } = match;
            const result = {};
            let [, , dest] = rule;
            /**
             * bind params and matches to ctx
             */
            Object.assign(ctx, { params, matches });
            if (typeof dest === 'function') {
                const res = await dest.call(this.router, ctx, params, matches);
                if (res)
                    dest = res;
            }
            else if (Array.isArray(dest)) {
                let res;
                for (const item of dest) {
                    res = await item.call(this.router, ctx, params, matches); // eslint-disable-line no-await-in-loop
                }
                if (res)
                    dest = res;
            }
            if (typeof dest === 'string') {
                const [controller, action = DEFAULT_CONTROLLER] = dest.replace(/\$([A-Z-a-z-0-9_-]+)/g, (m, n) => {
                    return (/^\d+$/.test(n) ? matches[n] : params[n]) || m;
                }).split('.');
                Object.assign(result, { controller, action });
            }
            else {
                Object.assign(result, dest);
            }
            if (result.module) {
                console.log(result);
            }
            else {
                result.controller ?? (result.controller = DEFAULT_CONTROLLER);
                result.action ?? (result.action = DEFAULT_ACTION);
                const action = this.actions[result.controller]?.[result.action];
                if (!action) {
                    ctx.status = 404;
                }
                else {
                    const body = await action.executor.call(this, ctx);
                    if (body !== undefined)
                        ctx.body = body;
                }
            }
        }
        return ctx;
    }
    listen(...args) {
        const server = http_1.default.createServer(async (req, res) => {
            const ctx = await this.handle({ request: { req }, response: { res }, app: this });
            respond_1.default(ctx, req, res);
        });
        server.listen(...args);
        const address = server.address();
        if (address && typeof address !== 'string') {
            this.logger.log(`Server is running on port ${address.port}.`);
        }
        else {
            this.logger.log(`Server is running on ${address}.`);
        }
        return (this.server = server);
    }
}
exports.default = Application;
_setup = new WeakMap(), _setupRouter = new WeakMap(), _setupControllers = new WeakMap();
