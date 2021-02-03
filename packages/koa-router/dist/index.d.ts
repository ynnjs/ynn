/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/router.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/01/2020
 * Description:
 ******************************************************************/
import { ParseOptions } from 'path-to-regexp';
import Koa, { KoaMiddleware } from '@ynn/koa';
export declare type Path = string | RegExp | (string | RegExp)[];
export declare type Handler = KoaMiddleware | KoaMiddleware[];
export declare type Method = (path: Path, fn: Handler) => Koa | KoaMiddleware;
export interface Router {
    app?: Koa;
}
declare function match(rule: string | RegExp | (string | RegExp)[], path: string, options?: Readonly<ParseOptions>): false | {
    params: Record<string, string>;
    matches: string[];
};
export default class implements Router {
    app?: Koa | undefined;
    static match: typeof match;
    get: Method;
    put: Method;
    head: Method;
    post: Method;
    patch: Method;
    delete: Method;
    options: Method;
    constructor(app?: Koa | undefined);
    any(methods: string | string[], ...args: Parameters<Method>): ReturnType<Method>;
}
export {};
