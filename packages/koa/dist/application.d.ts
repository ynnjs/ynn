/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/application.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 09/29/2020
 * Description:
 ******************************************************************/
/// <reference types="http-errors" />
/// <reference types="node" />
import http from 'http';
import { EventEmitter } from 'events';
import Keygrip from 'keygrip';
export declare type Keys = Keygrip | string[];
export declare type ApplicationOptions = {
    keys?: Keys;
    env?: string;
    proxy?: boolean;
    maxIpsCount?: number;
    proxyIpHeader?: string;
    subdomainOffset?: number;
};
export declare type Middleware = (...args: any[]) => any;
export default class Application extends EventEmitter {
    silent: boolean;
    proxy: boolean;
    trustXRealIp: boolean;
    proxyIpHeader: string;
    context: any;
    request: any;
    response: any;
    middleware: Middleware[];
    subdomainOffset: number;
    maxIpsCount: number;
    env: string;
    keys: Keys;
    static HttpError: import("http-errors").HttpErrorConstructor;
    constructor(options?: ApplicationOptions);
    /**
     * Shorthand for:
     *
     *      http.createServer( app.callback() ).listen( ... );
     *
     * @param {Mixed}
     * @return {Server}
     */
    listen(...args: any[]): http.Server;
    /**
     * Return JSON representation.
     * We only bother showing settings.
     *
     * @return {Object}
     */
    toJSON(): Record<string, any>;
    /**
     * Inspect implementation.
     *
     * @return {Object}
     */
    inspect(): Record<string, any>;
    /**
     * Use the given middleware `fn`
     */
    use(fn: Middleware): this;
    /**
     * Return a request handler callback
     * for node's native http server.
     *
     * @return {Function}
     */
    callback(): (req: any, res: any) => Promise<any>;
    /**
     * handle request in callback
     */
    handleRequest(ctx: any, middleware: Middleware): Promise<any>;
    /**
     * Initialize a new context
     */
    createContext(req: any, res: any): any;
    /**
     * Default error handler.
     */
    onerror(e: any): void;
}
