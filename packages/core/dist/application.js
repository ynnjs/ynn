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
var _setup, _setupOptions, _setupDebug, _setupLogger, _setupRouter, _setupControllers, _setupActions;
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const path_1 = __importDefault(require("path"));
const events_1 = __importDefault(require("events"));
const http_1 = __importDefault(require("http"));
const is_1 = __importDefault(require("@lvchengbin/is"));
const common_1 = require("@ynn/common");
const method_interceptor_1 = require("@ynn/method-interceptor");
const context_1 = __importDefault(require("./context"));
const action_1 = require("./action");
const router_1 = __importDefault(require("./router"));
const cargs_1 = __importDefault(require("./cargs"));
const logger_proxy_1 = __importDefault(require("./logger-proxy"));
const respond_1 = require("./util/respond");
const fill_params_1 = require("./util/fill-params");
const debug_1 = __importDefault(require("./debug"));
const CWD = process.cwd();
const DEFAULT_CONTROLLER = 'index';
const DEFAULT_ACTION = 'index';
class Application extends events_1.default {
    constructor(options = {}) {
        super();
        this.debugging = true;
        this.logging = false;
        this.maxIpsCount = 0;
        /**
         * require.main is undefined is such as interactive mode
         */
        this.root = require.main ? path_1.default.dirname(require.main.filename) : CWD;
        /**
         * map for actions
         */
        this.actions = {};
        _setup.set(this, (options) => {
            __classPrivateFieldGet(this, _setupOptions).call(this, options);
            __classPrivateFieldGet(this, _setupDebug).call(this);
            __classPrivateFieldGet(this, _setupLogger).call(this);
            __classPrivateFieldGet(this, _setupRouter).call(this);
            __classPrivateFieldGet(this, _setupControllers).call(this);
            __classPrivateFieldGet(this, _setupActions).call(this);
        });
        _setupOptions.set(this, (options) => {
            this.options = { ...options, ...this.parseCargs(cargs_1.default) };
        });
        _setupDebug.set(this, () => {
            const { options } = this;
            this.debug = options.debug ?? new debug_1.default({
                levels: options.debugging,
                ...options.debugOptions
            });
        });
        _setupLogger.set(this, () => {
            this.logger = logger_proxy_1.default(this);
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
            this.controllers = { ...this.options.controllers };
        });
        _setupActions.set(this, () => {
            const { controllers, actions } = this;
            controllers && Object.keys(controllers).forEach((controllerName) => {
                const Controller = controllers[controllerName];
                if (is_1.default.class(Controller)) {
                    const actionInfos = action_1.scan(Controller.prototype);
                    Object.keys(actionInfos).forEach((actionName) => {
                        const info = actionInfos[actionName];
                        const { descriptor, methodName, proto } = info;
                        if (!actions[controllerName]) {
                            actions[controllerName] = {};
                        }
                        const before = method_interceptor_1.createInterceptorBefore(descriptor);
                        const after = method_interceptor_1.createInterceptorAfter(descriptor);
                        const exception = method_interceptor_1.createInterceptorException(descriptor);
                        const parameter = method_interceptor_1.createInterceptorParameter(proto, methodName);
                        const metadataParameter = method_interceptor_1.getMetadataParameter(proto, methodName);
                        const paramtypes = Reflect.getMetadata('design:paramtypes', proto, methodName);
                        const constructorParameter = method_interceptor_1.createInterceptorParameter(Controller);
                        const constructorMetadataParameter = method_interceptor_1.getMetadataParameter(Controller);
                        const constructorParamtypes = Reflect.getMetadata('design:paramtypes', Controller);
                        const executor = async (context) => {
                            try {
                                await before(context);
                                const constructorParams = await fill_params_1.fillParams(await constructorParameter(context), constructorMetadataParameter, constructorParamtypes, [context]);
                                const controller = new Controller(...constructorParams);
                                const params = await fill_params_1.fillParams(await parameter(context), metadataParameter, paramtypes, [context]);
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
        // this.#setupModules();
        // this.#setupProviders();
        // this.modules = { ...options.modules };
        // this.controllers = { ...options.controllers };
    }
    parseCargs(cargs) {
        const options = {};
        if ('port' in cargs) {
            if (!is_1.default.integer(cargs.port))
                throw new TypeError('--port must be a integer');
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
                console.log('~~~~~~~~~~~~~~~', result); // eslint-disable-line
            }
            else {
                result.controller ?? (result.controller = DEFAULT_CONTROLLER);
                result.action ?? (result.action = DEFAULT_ACTION);
                const action = this.actions[result.controller]?.[result.action];
                if (!action) {
                    ctx.status = 404;
                }
                else {
                    try {
                        const body = await action.executor.call(this, ctx);
                        if (body !== undefined)
                            ctx.body = body;
                    }
                    catch (e) {
                        if (typeof e === 'number') {
                            ctx.status = e;
                        }
                        else if (typeof e === 'string') {
                            ctx.status = 500;
                            ctx.message = e;
                        }
                        else if (e instanceof common_1.HttpException) {
                            if (e.response) {
                                ctx.body = e.response;
                                ctx.status = e.response.status;
                                ctx.message = e.response.error;
                            }
                            else {
                                ctx.status = e.status;
                                ctx.message = e.message;
                            }
                        }
                        else {
                            this.logger.error(e);
                            ctx.status = 500;
                        }
                    }
                }
            }
        }
        return ctx;
    }
    listen(...args) {
        const server = http_1.default.createServer(async (req, res) => {
            try {
                const ctx = await this.handle({
                    request: {
                        req,
                        proxy: this.proxy,
                        maxIpsCount: this.maxIpsCount
                    },
                    response: { res },
                    logger: this.logger,
                    debug: this.debug
                });
                respond_1.respond(ctx, req, res);
                this.debug.debug(`[Ynn] ${ctx.ip} - - ${new Date} "${ctx.method}: ${ctx.url}" ${res.statusCode} ${(process.hrtime.bigint() - ctx.startTime) / 1000000n}ms`);
            }
            catch (e) {
                this.debug.log(`[Ynn] ${e?.message}`); // eslint-disable-line @typescript-eslint/no-explicit-any
            }
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
    toJSON() {
        return {
            controllers: this.controllers
        };
    }
}
exports.default = Application;
_setup = new WeakMap(), _setupOptions = new WeakMap(), _setupDebug = new WeakMap(), _setupLogger = new WeakMap(), _setupRouter = new WeakMap(), _setupControllers = new WeakMap(), _setupActions = new WeakMap();
Application.cargs = cargs_1.default;
